import type { Component } from "solid-js";

import { A } from "solid-start";

interface BootButtonProps {
  name: string
}

interface BootButtonLinkProps extends BootButtonProps {
  type: "link",
  href: string
}

interface BootButtonSubmitProps extends BootButtonProps {
  type: "submit"
}

const BootButton: Component<BootButtonLinkProps | BootButtonSubmitProps> = (props) => {
  const CLASSNAME = "w-full px-4 py-2 border border-white bg-black hover:bg-white hover:text-black transition hover:-translate-y-0.5";

  return (
    props.type === "link" ? (
      <A class={CLASSNAME} href={props.href}>
        {props.name}
      </A>
    )
    // props.type === "submit"
    : (
      <button class={CLASSNAME} type="submit">
        {props.name}
      </button>
    )
  );
};

export default BootButton;
