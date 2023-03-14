// @refresh reload
import "@fontsource/fira-code/400.css";
import "@/styles/globals.css";

import { Suspense, onMount, Switch, Match, createMemo, createEffect, on } from "solid-js";
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
  useNavigate,
  useLocation
} from "solid-start";

import FullLogo from "@/assets/logos/FullLogo";
import { user, setUser } from "@/stores/user";

export default function Root () {
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserAuthentication = async () => {
    const response = await fetch("/api/user");

    if (response.ok) {
      const body = await response.json();

      setUser({
        loaded: true,
        logged_in: true,

        username: body.data.user.username,
        id: body.data.user.id
      });

      return true;
    }

    setUser({
      loaded: true,
      logged_in: false
    });

    return false;
  }

  /** When we ended the API check for existing user session and API responded with an user. */
  const userLoadedAndLogged = createMemo(() => user.loaded && user.logged_in);
  /** When we ended the API check for existing user session and API responded with an error - no user. */
  const userLoadedAndNotLogged = () => user.loaded && !user.logged_in;

  // Check user authentication when we first load the web app.
  onMount(checkUserAuthentication);

  // We check at every location/authentication change.
  createEffect(on([() => location.pathname, () => user.logged_in], ([path]) => {
    if (userLoadedAndNotLogged() && !path.includes("/boot")) {
      navigate("/boot");
      return;
    }

    if (userLoadedAndLogged() && path.includes("/boot")) {
      navigate("/dashboard");
      return;
    }
  }));


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
        <main class="min-h-screen w-full transition-colors bg-black"
          classList={{
            "flex flex-col items-center justify-center": !user.logged_in,
          }}
        >
          <Motion.div class="w-full flex justify-center items-center pointer-events-none"
            animate={{ opacity: userLoadedAndLogged() ? 0 : 1 }}
            transition={{ duration: 1, delay: 2.5 }}
            classList={{
              "z-50 fixed inset-0 min-h-screen flex-col bg-black": userLoadedAndLogged()
            }}
          >
            <Motion.div class="w-full flex justify-center items-center"
              animate={{ opacity: userLoadedAndLogged() ? 0 : 1 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <FullLogo class={`h-auto w-full max-w-[600px] ${user.loaded ? "full-logo-active" : "full-logo-not-active"}`} />
            </Motion.div>
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

                  <Match when={userLoadedAndNotLogged()}>
                    <Motion.div
                      class="max-h-0 flex flex-col items-center justify-center gap-6 transition-[max-height] duration-1000 ease-in overflow-hidden"
                      initial={{
                        maxHeight: 0,
                        marginTop: 0,
                        opacity: 0,
                        y: -8
                      }}
                      animate={{
                        maxHeight: "100vh",
                        marginTop: "12px",
                        opacity: 1,
                        y: 0
                      }}
                      transition={{ delay: 2, duration: 2 }}
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
