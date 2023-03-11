import type { Component } from "solid-js";

import { A } from "solid-start";
import { createSignal } from "solid-js";

import { writeText } from "@/utils/animations";
import BootButton from "@/components/boot/Button";

const BootMainPage: Component = () => {
  const [text, setText] = createSignal("");

  writeText({
    speed: 20,
    text: "# démarrage du processus d'identification.",
    onTextEdit: (char) => setText(prev => prev + char)
  });

  return (
    <>
      <h1 class="font-mono text-[12px] sm:text-[18px] text-[#999999]">
        {text}
      </h1>

      <div class="mt-6 flex gap-4 font-mono">
        <BootButton
          type="link"
          href="./signin"
          name="Connexion"
        />

        <BootButton
          type="link"
          href="./signup"
          name="Inscription"
        />
      </div>

      <a
        class="font-mono text-[#CCCCCC] border-b border-b-[#CCCCCC] hover:text-[#B3B3B3] hover:border-b-[#B3B3B3]"
        href="https://github.com/MilesCodeIt/your-private-life-new"
        target="_blank"
      >
        GitHub
      </a>
    </>
  )
};

export default BootMainPage;