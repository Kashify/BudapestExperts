import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CaretDown,
  CaretRight,
  CheckCircle,
  Clock,
  CurrencyCircleDollar,
  Funnel,
  Handshake,
  MapPin,
  PaperPlaneTilt,
  UserCircle,
} from "@phosphor-icons/react";
import { negotiations } from "../data";

export interface NegotiationPortalProps {
  activeThread: string;
  setActiveThread: (id: string) => void;
  onNotice: (message: string) => void;
}

export function NegotiationPortal({ activeThread, setActiveThread, onNotice }: NegotiationPortalProps) {
  const [threads, setThreads] = useState(negotiations);
  const [filter, setFilter] = useState("All conversations");
  const [draft, setDraft] = useState("");
  const [acceptedOffers, setAcceptedOffers] = useState<Record<string, boolean>>({});
  const [showDetails, setShowDetails] = useState(false);

  const filteredThreads = useMemo(() => {
    if (filter === "Offers received") {
      return threads.filter((item) => item.status === "Offer received" || item.status === "Offer accepted");
    }
    return threads;
  }, [threads, filter]);

  const thread = threads.find((item) => item.id === activeThread) ?? filteredThreads[0] ?? threads[0];
  const isAccepted = Boolean(acceptedOffers[thread.id]);

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    setThreads((prevThreads) =>
      prevThreads.map((item) => {
        if (item.id === thread.id) {
          return {
            ...item,
            status: "You sent a message",
            time: "Just now",
            messages: [
              ...item.messages,
              { from: "you", text: trimmed, time: timeStr },
            ],
          };
        }
        return item;
      })
    );
    setDraft("");
    onNotice(`Message sent to ${thread.name}.`);
  };

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const acceptCurrentOffer = () => {
    setAcceptedOffers((prev) => ({ ...prev, [thread.id]: true }));
    setThreads((prevThreads) =>
      prevThreads.map((item) =>
        item.id === thread.id
          ? { ...item, status: "Offer accepted" }
          : item
      )
    );
    onNotice(`Proposal accepted for ${thread.name} (Ft ${thread.offer.amount}).`);
  };

  return (
    <section className="negotiation-section" id="negotiation">
      <div className="negotiation-heading">
        <div>
          <span className="sample-label">Private workspace · prototype data</span>
          <h2>Where a match becomes an agreement.</h2>
          <p>Keep the request, conversation and offer together. Negotiate with context before you commit.</p>
        </div>
        <div className="negotiation-orbit" aria-hidden="true">
          <span className="orbit-core"><Handshake size={28} weight="duotone" /></span>
          <span className="orbit-node node-one"><UserCircle size={18} /></span>
          <span className="orbit-node node-two"><CurrencyCircleDollar size={18} /></span>
          <span className="orbit-node node-three"><CheckCircle size={18} /></span>
        </div>
      </div>

      <div className="negotiation-shell">
        <aside className="thread-list" aria-label="Negotiation conversations">
          <div className="thread-list-top">
            <div><strong>Conversations</strong><span>{filteredThreads.length} active</span></div>
            <button
              type="button"
              aria-label="Filter conversations"
              onClick={() => {
                const nextFilter = filter === "All conversations" ? "Offers received" : "All conversations";
                setFilter(nextFilter);
                if (nextFilter === "Offers received") {
                  const match = threads.find((item) => item.status === "Offer received" || item.status === "Offer accepted");
                  if (match) setActiveThread(match.id);
                }
              }}
            >
              <Funnel size={18} />
            </button>
          </div>
          <div className="thread-filter">{filter}<CaretDown size={14} /></div>
          {filteredThreads.map((item) => (
            <button
              className={`thread-item ${item.id === thread.id ? "is-active" : ""}`}
              type="button"
              key={item.id}
              onClick={() => {
                setActiveThread(item.id);
              }}
            >
              <span className={`thread-avatar ${item.accent}`}>{item.initials}</span>
              <span className="thread-summary"><strong>{item.name}</strong><small>{item.request}</small><span>{item.status}</span></span>
              <span className="thread-time">{item.time}</span>
            </button>
          ))}
          <button className="new-request-link" type="button" onClick={() => onNotice("Start a new request from the search above.")}><span>+</span> New request</button>
        </aside>

        <div className="conversation-panel">
          <header className="conversation-header">
            <div><span className={`thread-avatar ${thread.accent}`}>{thread.initials}</span><div><strong>{thread.name}</strong><small>{thread.role} · {thread.request}</small></div></div>
            <button
              className={`conversation-more ${showDetails ? "is-active" : ""}`}
              type="button"
              aria-label={showDetails ? "Hide conversation details" : "Open conversation details"}
              aria-expanded={showDetails}
              onClick={toggleDetails}
            >
              <CaretRight size={20} />
            </button>
          </header>
          {showDetails && (
            <div className="conversation-details-drawer">
              <div><strong>Scope:</strong> {thread.request}</div>
              <div><strong>Expert:</strong> {thread.name} ({thread.role})</div>
              <div><strong>Proposal:</strong> Ft {thread.offer.amount} {thread.offer.unit} · {thread.offer.expires}</div>
              <div><strong>Status:</strong> {isAccepted ? "Accepted" : thread.status}</div>
            </div>
          )}
          <div className="conversation-body">
            <div className="request-summary"><span><MapPin size={16} weight="fill" /> {thread.request}</span><span><Clock size={16} /> Updated {thread.time.toLowerCase()}</span></div>
            <div className="message-stack">
              {thread.messages.map((message, index) => <div className={`message-row ${message.from === "you" ? "from-you" : ""}`} key={`${thread.id}-${index}`}><div><p>{message.text}</p><small>{message.from === "you" ? "You" : thread.name} · {message.time}</small></div></div>)}
            </div>
          </div>
          <div className="offer-panel">
            <div className="offer-label"><span><CurrencyCircleDollar size={19} weight="duotone" /> Current proposal</span><small>{thread.offer.expires}</small></div>
            <div className="offer-row">
              <div><strong>Ft {thread.offer.amount}</strong><span>{thread.offer.unit}</span></div>
              {isAccepted ? (
                <span className="accepted-offer"><CheckCircle size={18} weight="fill" /> Accepted</span>
              ) : (
                <button className="button button-blue" type="button" onClick={acceptCurrentOffer}>
                  Accept proposal <ArrowRight size={17} weight="bold" />
                </button>
              )}
            </div>
            <button className="counter-link" type="button" onClick={() => onNotice("Counter-offer mode is ready for backend integration.")}>Make a counter-offer <ArrowRight size={15} /></button>
          </div>
          <form className="message-composer" onSubmit={sendMessage}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message about the work…" aria-label="Message expert" /><button type="submit" aria-label="Send message"><PaperPlaneTilt size={19} weight="fill" /></button></form>
        </div>
      </div>
    </section>
  );
}

export default NegotiationPortal;
