import { PropsWithChildren } from "react";

export default function Section({ children }: PropsWithChildren) {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="glass glass--panel p-6 md:p-8">{children}</div>
    </section>
  );
}


