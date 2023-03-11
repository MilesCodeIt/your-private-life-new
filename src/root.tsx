// @refresh reload
import "@fontsource/fira-code/400.css";
import "@/styles/globals.css";

import { Suspense, onMount, Switch, Match } from "solid-js";
import { Motion, Presence } from "@motionone/solid";

import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  Link,
  useNavigate
} from "solid-start";

import FullLogo from "@/assets/logos/FullLogo";
import { user, setUser } from "@/stores/user";

export default function Root () {
  const navigate = useNavigate();

  onMount(async () => {
    const response = await fetch("/api/user");
    
    // User is logged in.
    if (response.ok) {
      const body = await response.json();

      setUser({
        loaded: true,
        logged_in: true,

        username: body.data.user.username,
        id: body.data.user.id
      });

      navigate("/dashboard");
      return;
    }

    // User is not logged in.
    setUser({ loaded: true, logged_in: false });
    navigate("/boot");
  });

  /** When we ended the API check for existing user session and API responded with an user. */
  const userLoadedAndLogged = () => user.loaded && user.logged_in;
  /** When we ended the API check for existing user session and API responded with an error - no user. */
  const userLoadedAndNotLogged = () => user.loaded && !user.logged_in;

  return (
    <Html lang="fr">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />

        <Link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <Link rel="icon" href="/favicon.ico" sizes="any" />

        <Meta name="color-scheme" content="dark light" />
        <Meta name="theme-color" content="#000000" />

        <Title>Your Private Life</Title>
      </Head>

      <Body>
        <main class="min-h-screen w-full"
          classList={{
            "flex flex-col items-center justify-center bg-black": !user.logged_in
          }}
        >
          <Motion.div class="w-full flex justify-center items-center"
            animate={{ opacity: userLoadedAndLogged() ? 0 : 1 }}
            transition={{ duration: 1, delay: 2 }}
            classList={{
              "z-50 fixed inset-0 min-h-screen flex-col bg-black": userLoadedAndLogged()
            }}
          >
            <FullLogo class={`h-auto w-full max-w-[600px] ${user.loaded ? "full-logo-active" : "full-logo-not-active"}`} />
          </Motion.div>

          <Suspense>
            <ErrorBoundary>
              <Presence exitBeforeEnter>
                <Switch>
                  <Match when={userLoadedAndLogged()}>
                    <Routes>
                      <FileRoutes />
                    </Routes>
                  </Match>

                  <Match when={!user.loaded || userLoadedAndNotLogged()}>
                    <Motion.div
                      class="flex flex-col items-center justify-center gap-6 transition-[max-height] duration-1000 ease-in overflow-hidden"
                      classList={{ "hidden": !user.loaded }}
                      animate={{
                        // Expand animation.
                        maxHeight: userLoadedAndNotLogged() ? "100vh" : 0,
                        // Gap between full text logo and `/boot` pages.
                        marginTop: userLoadedAndNotLogged() ? "12px" : 0,
                        // Smooth.
                        opacity: userLoadedAndNotLogged() ? 1 : 0,
                        y: userLoadedAndNotLogged() ? 0 : -8
                      }}
                      transition={{ delay: 1, duration: 2 }}
                    >
                      <Routes>
                        <FileRoutes />
                      </Routes>
                    </Motion.div>
                  </Match>
                </Switch>
              </Presence>
            </ErrorBoundary>
          </Suspense>
        </main>

        <Scripts />
      </Body>
    </Html>
  );
}
