// @refresh reload
import "@fontsource/fira-code/400.css";
import "@/styles/globals.css";


import { Suspense } from "solid-js";
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
  Link
} from "solid-start";

export default function Root () {
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

        <Meta name="title" content="Your Private Life" />
        <Meta name="description" content="Your Private Life est un jeu web permettant de faire de la prévention sur les dangers du web et de l'Internet." />
        <Link rel="canonical" href="https://your-private-life.vercel.app" />

        <Meta property="og:type" content="website" />
        <Meta property="og:url" content="https://your-private-life.vercel.app" />
        <Meta property="og:title" content="Your Private Life" />
        <Meta property="og:description" content="Your Private Life est un jeu web permettant de faire de la prévention sur les dangers du web et de l'Internet." />

        <Meta property="twitter:card" content="summary_large_image" />
        <Meta property="twitter:url" content="https://your-private-life.vercel.app" />
        <Meta property="twitter:title" content="Your Private Life" />
        <Meta property="twitter:description" content="Your Private Life est un jeu web permettant de faire de la prévention sur les dangers du web et de l'Internet." />
      </Head>

      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
