import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, X } from "@phosphor-icons/react";
import { services, districts } from "../data";

export interface RequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: string;
  onServiceChange: (service: string) => void;
  district: string;
  onDistrictChange: (district: string) => void;
}

export function RequestDialog({
  isOpen,
  onClose,
  service,
  onServiceChange,
  district,
  onDistrictChange,
}: RequestDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = useCallback(() => {
    setSubmitted(false);
    onClose();
  }, [onClose]);

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button, input, select, textarea, [href]"
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    const background = Array.from(
      document.querySelectorAll<HTMLElement>("header, main, footer, .skip-link")
    );
    background.forEach((element) => {
      element.inert = true;
    });
    document.body.classList.add("no-scroll");
    window.addEventListener("keydown", onKeyDown);

    window.setTimeout(
      () => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(),
      0
    );

    return () => {
      background.forEach((element) => {
        element.inert = false;
      });
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        ref={dialogRef}
        className="request-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-title"
        aria-describedby="request-description"
      >
        <button
          className="dialog-close"
          type="button"
          onClick={handleClose}
          aria-label="Close request form"
        >
          <X size={22} />
        </button>
        {submitted ? (
          <div className="success-state" aria-live="polite">
            <span>
              <Check size={32} weight="bold" />
            </span>
            <h2 id="request-title">Your request is ready.</h2>
            <p id="request-description">
              This prototype does not send data yet. Connect the form to your backend
              to start matching customers.
            </p>
            <button
              className="button button-dark"
              type="button"
              onClick={handleClose}
              data-autofocus
            >
              Close preview
            </button>
          </div>
        ) : (
          <form onSubmit={submitRequest}>
            <span className="sample-label">Request preview</span>
            <h2 id="request-title">What can an expert help with?</h2>
            <p id="request-description">
              Share the essentials. You can discuss private details directly with your
              chosen expert.
            </p>
            <div className="form-grid">
              <label>
                <span>Service</span>
                <select
                  data-autofocus
                  value={service}
                  onChange={(event) => onServiceChange(event.target.value)}
                >
                  {services.map((item) => (
                    <option key={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>District</span>
                <select
                  value={district}
                  onChange={(event) => onDistrictChange(event.target.value)}
                >
                  {districts.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              <span>Your situation</span>
              <textarea
                required
                minLength={20}
                placeholder="For example: I’m moving to District XI next month and need help reviewing a rental agreement…"
              />
            </label>
            <label>
              <span>Email</span>
              <input required type="email" placeholder="you@example.com" />
            </label>
            <button className="button button-blue submit-button" type="submit">
              Preview my request <ArrowRight size={18} weight="bold" />
            </button>
            <small>No data is sent in this frontend demonstration.</small>
          </form>
        )}
      </section>
    </div>
  );
}

export default RequestDialog;
