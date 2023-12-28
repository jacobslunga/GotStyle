"use client";

import { FC, useState } from "react";

const ContactModal: FC = () => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSending(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        setIsSent(true);
        setEmail("");
        setMessage("");
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Failed to send email", error);
    }

    setIsSending(false);
  };

  return (
    <dialog
      id="contact_modal"
      className="modal modal-bottom sm:modal-middle bg-[rgba(0,0,0,0.5)]"
    >
      <div className="modal-box bg-[#201e26]">
        <h3 className="font-bas-bold text-lg text-white">Contact Us</h3>
        <p className="font-bas-reg text-gray-400 text-sm mt-2">
          Write a message and we will get back to you as soon as possible.
        </p>

        <form method="dialog" className="mt-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-400 font-bas-reg">Email</span>
            <input
              type="email"
              className="form-input rounded-md mt-1 outline-none p-2 block w-full bg-[rgba(255,255,255,0.1)] text-gray-200"
              placeholder="
                Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </label>
          <label className="block mt-3">
            <span className="text-gray-400 font-bas-reg">Message</span>
            <textarea
              className="form-textarea mt-1 rounded-md p-2 outline-none block w-full bg-[rgba(255,255,255,0.1)] text-gray-200"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <div className="mt-3 flex flex-row items-center justify-between">
            <button
              className={`${
                isSending ? "cursor-not-allowed" : ""
              } disabled:bg-transparent flex flex-row items-center justify-center font-bas-semi cursor-pointer disabled:cursor-not-allowed disabled:text-[rgba(255,255,255,0.2)] bg-white text-black px-5 py-2 rounded-full`}
              disabled={isSending || !(email && message)}
              type="submit"
            >
              {isSending ? "Sending..." : "Send"}
              {isSending && (
                <span className="loading loading-spinner loading-sm ml-2"></span>
              )}
            </button>
            <button className="text-[rgba(255,255,255,0.5)] font-bas-reg">
              Cancel
            </button>
          </div>
        </form>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn text-gray-200 btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ContactModal;
