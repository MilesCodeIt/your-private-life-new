import type { Component } from "solid-js";
import FullLogo from "@/assets/logos/FullLogo";

import { Outlet } from "solid-start";

import { createSignal } from "solid-js";
import { Presence, Motion } from "@motionone/solid";

const BootPage: Component = () => {
  const [isBooting, setIsBooting] = createSignal(true);
  setTimeout(() => setIsBooting(false), 2000);

  return (
    <main class="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black">
      <div class="h-auto w-full max-w-[600px]">
        <FullLogo class={!isBooting() ? "full-logo-active" : "full-logo-not-active"} />
      </div>

      <Presence exitBeforeEnter>
        <Motion.div
          class="mt-3 flex flex-col items-center justify-center gap-6 transition-[max-height] duration-1000 ease-in overflow-hidden"
          style={{ "max-height": isBooting() ? 0 : "100vh" }}
          initial={{ opacity: 0, y: -10, marginTop: 0 }}
          animate={{ opacity: 1, y: 0, marginTop: "12px" }}
          transition={{ delay: 2, duration: 1 }}
        >
          <Outlet />
        </Motion.div>
      </Presence>
    </main>
  )
};

export default BootPage;
