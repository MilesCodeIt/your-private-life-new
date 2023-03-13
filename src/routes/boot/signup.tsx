import type { JSX, Component } from "solid-js";

import type {
  HCaptchaFunctions,
  HCaptchaExecuteResponse
} from "solid-hcaptcha";

import { createSignal } from "solid-js";
import HCaptcha from "solid-hcaptcha";
import { A } from "solid-start";

import { writeText } from "@/utils/animations";

import BootInput from "@/components/boot/Input";
import BootButton from "@/components/boot/Button";

const BootSigninPage: Component = () => {
  const [text, setText] = createSignal("");
  
  let hcaptcha: HCaptchaFunctions | undefined;
  const [email, setEmail] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  writeText({
    speed: 20,
    text: "# création de l'identité.",
    onTextEdit: (char) => setText(prev => prev + char)
  });

  const handleFormSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (event) => {
    event.preventDefault();
    if (!hcaptcha) return;

    const captcha = await hcaptcha.execute();
    if (!captcha) {
      hcaptcha.resetCaptcha();
      return;
    };

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        username: username(),
        password: password(),
        email: email(),
        captcha: captcha.response
      })
    });
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
          placeholder="nom d'utilisateur"

          value={username()}
          setValue={(value) => setUsername(value)}
        />

        <BootInput
          type="email"
          placeholder="e-mail"

          value={email()}
          setValue={(value) => setEmail(value)}
        />

        <BootInput
          type="password"
          placeholder="mot de passe"

          value={password()}
          setValue={(value) => setPassword(value)}
        />

        <HCaptcha
          sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
          onLoad={hcaptcha_instance => (hcaptcha = hcaptcha_instance)}
          size="invisible"
        />

        <div class="mt-4">
          <BootButton
            type="submit"
            name="Inscription"
          />
        </div>
      </form>

      <p class="mt-8 font-mono text-sm text-[#999999]">
        vous avez déjà un compte ? <A class="text-[#CCCCCC] border-b border-b-[#CCCCCC] hover:text-[#B3B3B3] hover:border-b-[#B3B3B3]" href="/boot/signin">connectez-vous</A>
      </p>
    </>
  )
};

export default BootSigninPage;
