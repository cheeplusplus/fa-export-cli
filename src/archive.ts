import { createWriteStream, existsSync } from "fs";
import * as fs from "fs/promises";
import { getClient } from "./api";
import * as path from "path";
import { SubmissionListing } from "fa.js";
import { finished } from "stream/promises";
import { Readable } from "stream";
import { Command } from "@commander-js/extra-typings";

const DEFAULT_DELAY_MS = 100;

const delay = (timeout: number) =>
  new Promise<void>((res) => setTimeout(() => res(), timeout));

async function downloadSubmissions(
  dir: string,
  submissionList: SubmissionListing[]
) {
  const client = getClient();

  for (const submissionItem of submissionList) {
    await delay(DEFAULT_DELAY_MS);

    try {
      console.log(
        `    > Submission: ${submissionItem.title} by ${submissionItem.artist_name}`
      );

      // Fetch the full submission details
      const fullSubmission = await client.getSubmission(submissionItem.id);
      if (!fullSubmission.content_url) {
        console.error(
          `    X Submission ${submissionItem.id} had no content URL`
        );
        continue;
      }

      // Write to JSON
      await fs.writeFile(
        path.join(dir, `${submissionItem.id}.json`),
        JSON.stringify(fullSubmission, undefined, 4)
      );

      // Fetch the content data
      const contentFilename = path.join(
        dir,
        path.basename(fullSubmission.content_url)
      );

      if (existsSync(contentFilename)) {
        continue;
      }

      await delay(DEFAULT_DELAY_MS);

      // Download and save the content data
      const res = await fetch(fullSubmission.content_url);
      if (!res.body) {
        console.error(`    X Submission ${submissionItem.id} had no body`);
        continue;
      }

      const stream = createWriteStream(contentFilename);
      await finished(Readable.fromWeb(res.body).pipe(stream));
    } catch (err) {
      console.error(
        `    X Failed to read submission ${submissionItem.id}`,
        err
      );
    }
  }
}

async function downloadPaginatedSet<T>(
  iterator: AsyncGenerator<T[], T[], unknown>,
  basePath: string,
  prefix: string,
  dataOnly: boolean = false,
  downloader?: (basePath: string, page: T[]) => Promise<void>
) {
  let page = 1;
  for await (const pageData of iterator) {
    console.log(`   - Page ${page}`);

    // Write the full page JSON
    await fs.writeFile(
      path.join(basePath, `${prefix}_page_${page}.json`),
      JSON.stringify(pageData, undefined, 4)
    );

    page += 1;

    // Download contents if available
    if (!dataOnly && downloader) {
      await downloader(basePath, pageData);
    }
  }
}

async function archiveUser(
  username: string,
  opts: { dataOnly?: boolean; favesOnly?: boolean }
) {
  const basePath = path.join("output", path.normalize(username));
  const writeJson = (name: string, data: any) =>
    fs.writeFile(path.join(basePath, name), JSON.stringify(data, undefined, 4));

  const api = getClient();
  await fs.mkdir(basePath, { recursive: true });

  console.log(`Archiving ${username}...`);

  if (!opts.favesOnly) {
    // Profile
    console.log(" > Profile");
    await writeJson("profile.json", await api.getUserPage(username));
    await delay(DEFAULT_DELAY_MS);

    // Journals
    console.log(" > Journals");
    await downloadPaginatedSet(
      api.getUserJournals(username),
      basePath,
      "journals",
      true
    );
    await delay(DEFAULT_DELAY_MS);

    // Gallery
    console.log(" > Gallery");
    await downloadPaginatedSet(
      api.getUserGallery(username),
      basePath,
      "gallery",
      !!opts?.dataOnly,
      downloadSubmissions
    );
    await delay(DEFAULT_DELAY_MS);

    // Scraps
    console.log(" > Scraps");
    await downloadPaginatedSet(
      api.getUserScraps(username),
      basePath,
      "scraps",
      !!opts?.dataOnly,
      downloadSubmissions
    );
  } else {
    // Favorites
    const favePath = path.join(basePath, "favorites");
    await fs.mkdir(favePath, { recursive: true });

    console.log(" > Favorites");
    await downloadPaginatedSet(
      api.getUserFavorites(username),
      favePath,
      "favorites",
      !!opts?.dataOnly,
      downloadSubmissions
    );
  }

  console.log("Done!");
}

async function archiveNotes() {
  const basePath = path.join("output", "_notes");
  const writeJson = (name: string, data: any) =>
    fs.writeFile(path.join(basePath, name), JSON.stringify(data, undefined, 4));

  const api = getClient();
  await fs.mkdir(basePath, { recursive: true });

  console.log("Archiving notes...");

  console.log(" > Fetching list");
  const notes = await api.getNotes();
  await writeJson("notes.json", notes);

  for (const noteData of notes.notes) {
    console.log(` > ${noteData.id}`);
    await delay(DEFAULT_DELAY_MS);
    const note = await api.getNote(noteData.id);
    await writeJson(`${noteData.id}.json`, note);
  }

  console.log("Done!");
}

export const ARCHIVE_COMMAND = new Command("archive")
  .description("archival commands")
  .addCommand(
    new Command("user")
      .description("archive user")
      .option("--data-only", "only save data, no images")
      .argument("<username>", "Your username")
      .action((username, opts) => archiveUser(username, opts))
  )
  .addCommand(
    new Command("favorites")
      .description("archive favorites")
      .argument("<username>", "Your username")
      .action((username) => archiveUser(username, { favesOnly: true }))
  )
  .addCommand(
    new Command("notes")
      .description("archive notes - warning - marks all as read")
      .action(() => archiveNotes())
  );
