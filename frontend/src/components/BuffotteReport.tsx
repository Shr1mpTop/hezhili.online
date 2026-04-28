import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import "./BuffotteReport.css";
import "highlight.js/styles/github-dark.css";

const REPORT_SOURCE_BASE = "https://buffotte.hezhili.online/";

function toAbsoluteUrl(input?: string) {
  if (!input) return "";
  if (/^(?:https?:)?\/\//i.test(input)) return input;
  if (
    input.startsWith("#") ||
    input.startsWith("data:") ||
    input.startsWith("mailto:")
  )
    return input;
  try {
    return new URL(input, REPORT_SOURCE_BASE).toString();
  } catch {
    return input;
  }
}

function normalizeAssetUrls(html: string) {
  return html.replace(/(src|href)="([^"]+)"/gi, (match, attr, value) => {
    const absolute = toAbsoluteUrl(value);
    return absolute === value ? match : `${attr}="${absolute}"`;
  });
}

function formatDateTime(value?: string) {
  if (!value) return "";
  const compactPattern = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/;
  const match = value.match(compactPattern);
  let date: Date;
  if (match) {
    const isoValue = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`;
    date = new Date(isoValue);
  } else {
    date = new Date(value);
  }
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", { hour12: false });
}

function BuffotteReport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/buffotte/report", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`报告请求失败（${response.status}）`);
      }
      const payload = await response.json();
      if (payload.status && payload.status !== "success") {
        throw new Error(payload.message || "报告服务返回异常");
      }
      const data = payload.data || payload;
      setReport(data);

      const markdownSource =
        data.markdown_report && data.markdown_report.trim().length > 0
          ? data.markdown_report
          : (data.body || "").replace(/\n/g, "\n\n");

      const rendered = marked.parse(markdownSource) as string;
      setHtmlContent(normalizeAssetUrls(rendered));
      setLastFetchedAt(new Date());
    } catch (err: any) {
      setError(err?.message || "加载 Buffotte 报告失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const attachments = useMemo(
    () =>
      (report?.attachments || []).map((path: string) => ({
        name: path.split("/").pop() || path,
        url: toAbsoluteUrl(path),
      })),
    [report],
  );

  const subjectLine = (report?.subject || "").trim();
  const generatedOn = formatDateTime(report?.generated_at);
  const reportDate = report?.date || "";
  const lastUpdated = lastFetchedAt
    ? lastFetchedAt.toLocaleString("zh-CN", { hour12: false })
    : "";

  return (
    <div className="buffotte-page">
      <div className="buffotte-wrapper">
        <header className="buffotte-header">
          <div className="header-text">
            <h1>Buffotte 市场报告</h1>
            <p className="header-meta">
              {subjectLine && <span>{subjectLine}</span>}
              {generatedOn && <span>生成时间：{generatedOn}</span>}
              {reportDate && <span>报告日期：{reportDate}</span>}
              {lastUpdated && <span>最近刷新：{lastUpdated}</span>}
            </p>
          </div>
          <button
            className="buffotte-refresh"
            type="button"
            onClick={fetchReport}
            disabled={loading}
          >
            {loading ? "刷新中…" : "刷新"}
          </button>
        </header>

        {loading && (
          <section className="buffotte-state">
            <div className="spinner" aria-hidden="true"></div>
            <p>正在获取 Buffotte 报告...</p>
          </section>
        )}

        {!loading && error && (
          <section className="buffotte-state buffotte-error">
            <p>{error}</p>
            <button
              className="buffotte-refresh"
              type="button"
              onClick={fetchReport}
            >
              重试
            </button>
          </section>
        )}

        {!loading && !error && (
          <section className="buffotte-content">
            {(subjectLine || generatedOn || reportDate || lastUpdated) && (
              <div className="buffotte-summary">
                <h2 className="summary-title">
                  {subjectLine || "Buffotte 每日情报"}
                </h2>
                <ul className="summary-meta">
                  {generatedOn && <li>生成时间：{generatedOn}</li>}
                  {reportDate && <li>报告日期：{reportDate}</li>}
                  {lastUpdated && <li>最近刷新：{lastUpdated}</li>}
                </ul>
              </div>
            )}

            {attachments.length > 0 && (
              <div className="buffotte-attachments">
                <h3>附件</h3>
                <ul>
                  {attachments.map((file: any) => (
                    <li key={file.url}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <article
              className="buffotte-markdown"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default BuffotteReport;
