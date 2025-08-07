import { Localized } from "src/i18n";

import { SparkList } from "./SparkList";

export default function SparksPage() {
  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        <Localized id="sparksPage.title" />
      </h1>
      <SparkList />
    </main>
  );
}
