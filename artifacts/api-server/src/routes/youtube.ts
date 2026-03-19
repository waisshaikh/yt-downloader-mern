import { Router, type Request, type Response } from "express";
import { spawn } from "child_process";

const router = Router();


const YTDLP = "python";

function runYtDlp(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python", ["-m", "yt_dlp", ...args]);
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => (stdout += d));
    proc.stderr.on("data", (d) => (stderr += d));

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || `yt-dlp exited with code ${code}`));
      }
    });

    proc.on("error", reject);
  });
}

// 🔥 GET VIDEO INFO
router.get("/youtube/info", async (req: Request, res: Response): Promise<void> => {
  const { url } = req.query as { url?: string };

  if (!url) {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  try {
    const raw = await runYtDlp([
      "--dump-json",
      "--no-playlist",
      "--no-warnings",
      url,
    ]);

    const info = JSON.parse(raw);

    const formats = (info.formats || [])
      .map((f: any) => {
        const hasVideo = f.vcodec && f.vcodec !== "none";
        const hasAudio = f.acodec && f.acodec !== "none";

        const height = f.height;
        const width = f.width;

        const resolution =
          height && width
            ? `${width}x${height}`
            : height
              ? `${height}p`
              : f.resolution || null;

        let quality = f.format_note;
        if (!quality) {
          if (hasVideo && height) quality = `${height}p`;
          else if (!hasVideo && hasAudio) quality = "audio only";
          else quality = f.format_id;
        }

        return {
          formatId: f.format_id,
          quality,
          ext: f.ext,
          resolution,
          filesize: f.filesize || f.filesize_approx || null,
          fps: f.fps || null,
          hasVideo,
          hasAudio,
        };
      })
      .filter((f: any) => f.hasVideo || f.hasAudio);

    res.json({
      id: info.id,
      title: info.title,
      thumbnail: info.thumbnail || null,
      duration: info.duration || null,
      uploader: info.uploader || null,
      viewCount: info.view_count || null,
      formats,
    });
  } catch (err: any) {
    console.error("yt-dlp info error:", err.message);
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

// 🔥 DOWNLOAD
router.get("/youtube/download", async (req: Request, res: Response): Promise<void> => {
  const { url, formatId } = req.query as { url?: string; formatId?: string };

  if (!url || !formatId) {
    res.status(400).json({ error: "Missing url or formatId" });
    return;
  }

  try {
    const filename = "video.mp4";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    const proc = spawn("python", [
      "-m",
      "yt_dlp",
      "-f",
      formatId,
      "-o",
      "-",
      url,
    ]);
    proc.stdout.pipe(res);

    proc.stderr.on("data", (d) => {
      console.error("yt-dlp stderr:", d.toString());
    });

    proc.on("error", () => {
      if (!res.headersSent) {
        res.status(500).json({ error: "Download failed" });
      }
    });

    req.on("close", () => {
      proc.kill();
    });
  } catch (err: any) {
    console.error("Download error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Download failed" });
    }
  }
});

export default router;