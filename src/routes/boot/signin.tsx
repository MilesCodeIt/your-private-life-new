import type { JSX, Component } from "solid-js";

import { createSignal } from "solid-js";
import { A, useNavigate } from "solid-start";

import { writeText } from "@/utils/animations";

import BootInput from "@/components/boot/Input";
import BootButton from "@/components/boot/Button";

const BootSigninPage: Component = () => {
  const navigate = useNavigate();
  const [text, setText] = createSignal("");
  
  const [uid, setUid] = createSignal("");
  const [password, setPassword] = createSignal("");

  writeText({
    speed: 20,
    text: "# identification en cours.",
    onTextEdit: (char) => setText(prev => prev + char)
  });

  const handleFormSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        uid: uid(),
        password: password()
      })
    });

    if (response.ok) navigate("/dashboard");
  }

  return (
    <>
      <h1 class="font-mono text-[12px] sm:text-[18px] text-[#999999]">
        {text()}
      </h1>

      <form class="mt-6 flex flex-col gap-2 font-mono max-w-[420px]"
        onSubmit={handleFormSubmit}
      >
        <BootInput
          type="text"
          placeholder="identifiant"

          value={uid()}
          setValue={(value) => setUid(value)}
        />

        <BootInput
          type="password"
          placeholder="mot de passe"

          value={password()}
          setValue={(value) => setPassword(value)}
        />

        <div class="mt-4">
          <BootButton
            type="submit"
            name="Connexion"
          />
        </div>
      </form>

      <p class="mt-8 font-mono text-sm text-[#999999]">
        pas de compte ? <A class="text-[#CCCCCC] border-b border-b-[#CCCCCC] hover:text-[#B3B3B3] hover:border-b-[#B3B3B3]" href="/boot/signup">inscrivez-vous</A>
      </p>
    </>
  )
};

export default BootSigninPage;
