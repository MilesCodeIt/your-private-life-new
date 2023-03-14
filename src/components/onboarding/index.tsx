import type { Component } from "solid-js";
import { Portal } from "solid-js/web";

import { createSignal } from "solid-js";
import { user } from "@/stores/user";

const Onboarding: Component = () => {
  const [selectedColor, setSelectedColor] = createSignal("#000");

  const UIColorPick: Component<{
    color: string
  }> = (props) => (
    <button type="button" class="w-12 h-12 rounded-full"
      onClick={() => setSelectedColor(props.color)}
      classList={{ "border-2 border-white": selectedColor() === props.color }}
      style={{ background: props.color }}
    />
  );

  return (
    <Portal>
      <div class="fixed h-screen w-full flex items-center justify-center inset-0 p-2">
        <div class="max-w-[500px] flex flex-col gap-6 bg-neutral-800 p-6">
          <p class="text-center opacity-80 text-sm font-mono">préparation du compte de {user.username}.</p>

          <div class="flex justify-center items-center gap-4">
            <UIColorPick color="#000" />
            <UIColorPick color="#ff0000" />
            <UIColorPick color="#00ff00" />
            <UIColorPick color="#0000ff" />
          </div>

          <button
            type="button"
            class="mt-4 font-mono px-4 py-1 border-2 font-medium border-white w-fit mx-auto hover:bg-white hover:text-neutral-800 transition-colors disabled:opacity-50"
          >
            continuer
          </button>
        </div>
      </div>
    </Portal>
  );
};

export default Onboarding;
