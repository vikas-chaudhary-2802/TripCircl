import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, MessageCircle, ArrowLeft, Users, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const Messages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(conversationId || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (conversationId) setActiveConv(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (activeConv) loadMessages(activeConv);
  }, [activeConv]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime
  useEffect(() => {
    if (!activeConv) return;
    const channel = supabase
      .channel(`msgs-${activeConv}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeConv}` },
        async (payload) => {
          const { data: senderProfile } = await supabase.from("profiles").select("name, avatar_url").eq("user_id", payload.new.sender_id).single();
          setMessages((prev) => [...prev, { ...payload.new, profiles: senderProfile }]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeConv]);

  const loadConversations = async () => {
    if (!user) return;
    const { data: participations } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (!participations?.length) { setLoading(false); return; }

    const convIds = participations.map((p) => p.conversation_id);
    const { data: convs } = await supabase
      .from("conversations")
      .select("*")
      .in("id", convIds)
      .order("created_at", { ascending: false });

    if (convs) {
      // Enrich with participant info and last message
      const enriched = await Promise.all(convs.map(async (conv) => {
        const { data: participants } = await supabase
          .from("conversation_participants")
          .select("user_id, profiles(name, avatar_url)")
          .eq("conversation_id", conv.id);

        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const otherParticipants = participants?.filter((p) => p.user_id !== user.id) || [];

        return {
          ...conv,
          participants: otherParticipants,
          lastMessage: lastMsg,
          displayName: conv.name || otherParticipants.map((p: any) => p.profiles?.name).filter(Boolean).join(", ") || "Unknown",
        };
      }));
      setConversations(enriched);
    }
    setLoading(false);
  };

  const loadMessages = async (convId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles!messages_sender_id_fkey(name, avatar_url)")
      .eq("conversation_id", convId)
      .order("created_at");
    if (data) setMessages(data);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !activeConv) return;
    await supabase.from("messages").insert({
      conversation_id: activeConv,
      sender_id: user.id,
      content: newMessage,
    });
    setNewMessage("");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-max px-4 pt-28 pb-12">
        <div className="grid gap-6 lg:grid-cols-3" style={{ minHeight: "calc(100vh - 200px)" }}>
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border p-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" /> Messages
                </h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-3 border-secondary border-t-transparent" />
                  </div>
                ) : conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => { setActiveConv(conv.id); navigate(`/messages/${conv.id}`, { replace: true }); }}
                      className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 border-b border-border ${activeConv === conv.id ? "bg-muted/70" : ""}`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${conv.type === "group" ? "bg-gradient-primary" : "bg-gradient-accent"} text-xs font-bold text-white`}>
                        {conv.type === "group" ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{conv.displayName}</p>
                        {conv.lastMessage && (
                          <p className="truncate text-xs text-muted-foreground">{conv.lastMessage.content}</p>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No conversations yet. Join a trip or message an organizer to start!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
              {activeConv ? (
                <>
                  <div className="border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setActiveConv(null); navigate("/messages", { replace: true }); }} className="lg:hidden text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <h3 className="font-semibold text-foreground">
                        {conversations.find((c) => c.id === activeConv)?.displayName || "Chat"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => {
                      const isMe = msg.sender_id === user.id;
                      const name = msg.profiles?.name || "Anonymous";
                      const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                      return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isMe ? "bg-secondary text-secondary-foreground" : "bg-gradient-accent text-white"}`}>
                            {initials}
                          </div>
                          <div className={`max-w-[70%] ${isMe ? "text-right" : ""}`}>
                            <p className="mb-1 text-xs font-medium text-muted-foreground">{name}</p>
                            <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                              {msg.content}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="h-11"
                      />
                      <Button onClick={handleSend} disabled={!newMessage.trim()} size="icon" className="h-11 w-11 shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageCircle className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose from your conversations on the left</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
