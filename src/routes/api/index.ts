import { json } from "solid-start";

export const GET = async () => {

  return json({
    success: true,
    message: "Hello World"
  })
} 