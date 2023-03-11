import type { Component } from "solid-js";

const BootInput: Component<{
  type: "text" | "password" | "email",
  
  value: string,
  setValue: (value: string) => unknown,

  placeholder?: string
}> = (props) => (
  <label class="grid grid-cols-2 gap-4 items-center">
    <p class="text-md text-[#CCCCCC] flex-shrink-0">{props.placeholder}:</p>
    <input type={props.type}
      class="text-lg w-full bg-transparent outline-none px-2 py-1"
      value={props.value}
      onInput={(event) => {
        const value = event.currentTarget.value;
        props.setValue(value);
      }}
  
      placeholder={props.placeholder}
    />
  </label>
);

export default BootInput;
