import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../locales/i18n";
import { extractLinks, createLinkInfo, checkAllLinks, checkSingleLink, filterLinks, groupByDomain, searchLinks, copyToClipboard } from "../lib/link-utils";
import { FileUploadTab } from "./file-upload";
import { TextInput } from "./text-input";
import { FilterBar } from "./filter-bar";
import { ActionBar } from "./action-bar";
import { LinkCard } from "./link-card";
import { DomainGroup } from "./domain-group";
import { Progress } from "./progress";
import {
	IconLink,
	IconCheckCircle,
	IconStar,
	IconDownload,
	IconExternalLink,
	IconClock,
	IconActivity,
	IconShield,
	IconRefresh,
	IconArrowUp,
} from "./icons";

export function LinkExtractor() {
	const { t } = useTranslation();
	const [links, setLinks] = useState<LinkInfo[]>([]);
	const rawFeaturesItems = t("features.items", { returnObjects: true });
	const rawHowItWorksSteps = t("how_it_works.steps", { returnObjects: true });
	const rawTestimonialItems = t("testimonials.items", { returnObjects: true });
	const rawTestimonialStats = t("testimonials.stats", { returnObjects: true });
	const rawFinalCtaTrustItems = t("final_cta.trust_items", { returnObjects: true });
	const featuresItems = (Array.isArray(rawFeaturesItems) ? rawFeaturesItems : []) as {
		title: string;
		description: string;
	}[];
	const howItWorksSteps = (Array.isArray(rawHowItWorksSteps) ? rawHowItWorksSteps : []) as {
		title: string;
		description: string;
	}[];
	const testimonialItems = (Array.isArray(rawTestimonialItems) ? rawTestimonialItems : []) as {
		quote: string;
		author: string;
		role: string;
	}[];
	const testimonialStats = (Array.isArray(rawTestimonialStats) ? rawTestimonialStats : []) as {
		number: string;
		label: string;
	}[];
	const finalCtaTrustItems = (Array.isArray(rawFinalCtaTrustItems) ? rawFinalCtaTrustItems : []) as string[];
	const [inputTab, setInputTab] = useState<"file" | "text">("text");
	const [filter, setFilter] = useState<FilterType>("all");
	const [checking, setChecking] = useState(false);
	const [checkedCount, setCheckedCount] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [groupView, setGroupView] = useState(false);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const rawLinkCount = links.length;

	const filteredLinks = useMemo(() => {
		const statusFiltered = filterLinks(links, filter);
		return searchLinks(statusFiltered, searchQuery);
	}, [links, filter, searchQuery]);

	const groupedLinks = useMemo(() => groupByDomain(filteredLinks), [filteredLinks]);

	const counts = useMemo(
		() => ({
			all: links.length,
			success: links.filter((l) => l.status === "success").length,
			error: links.filter((l) => l.status === "error" || l.status === "timeout").length,
			pending: links.filter((l) => l.status === "pending" || l.status === "checking").length,
		}),
		[links],
	);

	const progress = useMemo(() => {
		if (links.length === 0) return 0;
		return Math.round((checkedCount / links.length) * 100);
	}, [checkedCount, links.length]);

	const handleText = useCallback((text: string) => {
		const urls = extractLinks(text);
		const newLinks = urls.map(createLinkInfo);
		setLinks(newLinks);
		setCheckedCount(0);
		setFilter("all");
	}, []);

	const handleCopyLinks = useCallback(async (label: string, urls: string[]) => {
		const text = urls.join("\n");
		const ok = await copyToClipboard(text);
		if (ok) {
			setCopiedId(label);
			setTimeout(() => setCopiedId(null), 2000);
		}
	}, []);

	const handleCheckAll = useCallback(async () => {
		if (links.length === 0) return;
		setChecking(true);
		setCheckedCount(0);

		const initial = links.map((l) => ({ ...l, status: "pending" as const }));
		setLinks(initial);

		let count = 0;
		await checkAllLinks(initial, (id, result) => {
			setLinks((prev) =>
				prev.map((l) => {
					if (l.id !== id) return l;
					if (result.error === "checking") {
						count++;
						return { ...l, status: "checking" as const };
					}
					return {
						...l,
						status: result.success
							? ("success" as const)
							: result.error === "timeout"
								? ("timeout" as const)
								: ("error" as const),
						statusCode: result.statusCode,
						errorMessage: result.success ? undefined : result.message,
					};
				}),
			);
			count++;
			setCheckedCount(count);
		});

		setChecking(false);
	}, [links]);

	const handleDelete = useCallback((id: string) => {
		setLinks((prev) => prev.filter((l) => l.id !== id));
	}, []);

	const handleReverify = useCallback(
		async (id: string) => {
			const link = links.find((l) => l.id === id);
			if (!link) return;

			setLinks((prev) =>
				prev.map((l) =>
					l.id === id
						? {
								...l,
								status: "checking",
								statusCode: undefined,
								errorMessage: undefined,
							}
						: l,
				),
			);

			const result = await checkSingleLink(link.url);

			setLinks((prev) =>
				prev.map((l) => {
					if (l.id !== id) return l;
					return {
						...l,
						status: result.success ? "success" : result.error === "timeout" ? "timeout" : "error",
						statusCode: result.statusCode,
						errorMessage: result.success ? undefined : result.message,
					};
				}),
			);
		},
		[links],
	);

	const handleClear = useCallback(() => {
		setLinks([]);
		setCheckedCount(0);
		setFilter("all");
	}, []);

	return (
		<div className="min-h-screen bg-[var(--background)]">
			{/* ─── HERO ─── */}
			<section className="relative overflow-hidden pb-60 pt-20 sm:pt-28">
				{/* Organic decorations */}
				<div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary-light)] opacity-40 blur-3xl" />

				<div className="relative mx-auto max-w-7xl px-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
					{/* ── Text Column ── */}
					<div className="text-center lg:text-left">
						{/* Badge */}
						<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--primary-light)] px-4 py-1.5">
							<span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
							<span className="text-xs font-semibold dark:text-[var(--border)] text-white">{t("hero.badge")}</span>
						</div>

						<h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl lg:text-6xl">
							{t("hero.title_line1")}
							<br />
							<span className="text-[var(--primary)]">{t("hero.title_highlight")}</span>
						</h1>

						<p className="mx-auto mt-5 max-w-xl text-lg font-medium leading-relaxed text-[var(--foreground)] lg:mx-0">
							{t("hero.description")}
						</p>

						{/* CTA buttons */}
						<div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
							<button
								onClick={() => document.getElementById("input-card")?.scrollIntoView({ behavior: "smooth" })}
								className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(132,204,22,0.39)] transition-all duration-200 hover:bg-[var(--primary-dark)] hover:shadow-[0_6px_20px_-4px_rgba(132,204,22,0.5)] active:scale-[0.98]">
								<IconLink className="h-5 w-5" />
								{t("hero.cta")}
							</button>
							<span className="hidden text-sm text-[var(--muted-foreground)]/30 sm:inline">·</span>
							<div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)]">
								<IconCheckCircle className="h-4 w-4 text-[var(--primary)]" />
								{t("hero.free_tag")}
							</div>
						</div>

						{/* Social proof bar */}
						<div className="mt-12 flex items-center justify-center gap-6 lg:justify-start">
							<div className="flex -space-x-2">
								{["A", "M", "S", "J"].map((initial, i) => (
									<div
										key={i}
										className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white shadow-md">
										{initial}
									</div>
								))}
							</div>
							<div className="text-left text-sm font-semibold text-[var(--muted-foreground)]">
								<span className="text-[var(--foreground)]">100+</span> {t("hero.users_label")}
								<div className="flex items-center gap-1 text-xs text-[var(--primary)]">
									{[...Array(5)].map((_, i) => (
										<IconStar key={i} className="h-3 w-3" />
									))}
									<span className="ml-1 text-[var(--muted-foreground)]/60">{t("hero.rating_label")}</span>
								</div>
							</div>
						</div>
					</div>

					{/* ── Organic Composition ── */}
					<div className="relative mt-12 hidden lg:block">
						<div className="relative mx-auto flex h-[420px] w-full max-w-[480px] items-center justify-center">
							{/* Large circle */}
							<div className="absolute h-72 w-72 rounded-full border-4 border-[var(--primary-light)]">
								<div className="absolute inset-4 rounded-full bg-[var(--primary)]" />
							</div>

							{/* Rotated square */}
							<div className="absolute h-52 w-52 rotate-12 rounded-2xl border-4 border-[var(--primary-dark)] bg-[var(--card)]">
								<div className="flex h-full items-center justify-center -rotate-12">
									<IconLink className="h-10 w-10 text-[var(--primary)]" strokeWidth={2} />
								</div>
							</div>

							{/* Organic blob */}
							<div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-[var(--primary-light)]" />

							{/* Small decorative circle */}
							<div className="absolute -left-6 -top-6 h-12 w-12 rounded-full bg-[var(--primary)] shadow-md" />

							{/* Small decorative square */}
							<div className="absolute -right-10 top-10 h-8 w-8 rotate-45 rounded-lg bg-[var(--primary-dark)]" />

							{/* Result cards */}
							<div className="absolute -left-6 top-6 z-30 w-64 rounded-2xl border border-[var(--primary-light)] bg-[var(--card)] p-4 shadow-lg">
								<div className="mb-3 flex items-center gap-2">
									<div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)]">
										<IconLink className="h-4 w-4 text-white" strokeWidth={2} />
									</div>
									<span className="text-sm font-bold text-[var(--foreground)]">{t("results.badge")}</span>
								</div>
								<div className="space-y-2">
									{[
										{ url: "github.com", status: "✓ 200", color: "text-[var(--success)]" },
										{ url: "docs.google.com", status: "✓ 200", color: "text-[var(--success)]" },
										{ url: "example.org", status: "✗ 404", color: "text-[var(--error)]" },
									].map((item, i) => (
										<div key={i} className="flex items-center gap-2 rounded-lg bg-[var(--muted)] px-3 py-1.5">
											<span className={`text-xs font-bold ${item.color}`}>{item.status}</span>
											<span className="truncate text-xs font-semibold text-[var(--foreground)]">{item.url}</span>
										</div>
									))}
								</div>
							</div>

							{/* Export card */}
							<div className="absolute -bottom-2 -right-8 z-20 w-52 rounded-2xl border border-[var(--primary-light)] bg-[var(--card)] p-3 shadow-lg">
								<div className="flex items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-light)]">
										<IconDownload className="h-4 w-4 text-[var(--primary)]" />
									</div>
									<div>
										<div className="text-xs font-bold text-[var(--foreground)]">{t("action_bar.copied")}</div>
										<div className="text-[10px] text-[var(--muted-foreground)]">28 {t("input.links_count")} · CSV</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── INPUT CARD (floats above hero) ── */}
			<div id="input-card" className={`relative z-10 -mt-40 mx-auto max-w-4xl px-4 ${links.length > 0 ? 'pb-0' : 'pb-20'}`}>
				<div className="rounded-2xl border border-[var(--primary-light)] bg-[var(--card)] shadow-xl">
					{/* Tabs */}
					<div className="flex border-b border-[var(--primary-light)]">
						<button
							onClick={() => setInputTab("text")}
							className={`flex-1 px-4 py-4 text-sm font-semibold transition-all duration-200 rounded-tl-2xl ${
								inputTab === "text"
									? "bg-[var(--primary)] text-white"
									: "bg-[var(--card)] text-[var(--border)] hover:bg-[var(--muted)]"
							}`}>
							{t("input.text_tab")}
						</button>
						<button
							onClick={() => setInputTab("file")}
							className={`flex-1 px-4 py-4 text-sm font-semibold transition-all duration-200 rounded-tr-2xl ${
								inputTab === "file"
									? "bg-[var(--primary)] text-white"
									: "bg-[var(--card)] text-[var(--border)] hover:bg-[var(--muted)]"
							}`}>
							{t("input.file_tab")}
						</button>
					</div>
					<div className="p-6 sm:p-8">
						{inputTab === "text" ? (
							<TextInput onExtract={handleText} linkCount={rawLinkCount} />
						) : (
							<FileUploadTab onExtract={handleText} />
						)}
					</div>
				</div>
			</div>

			{/* ── RESULTS ── */}
			{links.length > 0 && (
				<div className="mx-auto mt-10 max-w-4xl space-y-4 px-4 pb-20">
					{/* Section label */}
					<div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-light)] px-4 py-1.5">
						<span className="h-2 w-2 rounded-full bg-white dark:bg-[var(--primary)]" />
						<span className="text-xs font-semibold text-white dark:text-[var(--border)]">{t("results.badge")}</span>
					</div>

					{/* Action bar + Filter */}
					<div className="space-y-4 rounded-2xl border border-[var(--primary-light)] bg-[var(--card)] p-4 shadow-lg sm:p-6">
						<ActionBar
							links={links}
							filter={filter}
							canCheck={counts.pending > 0}
							checking={checking}
							onCheckAll={handleCheckAll}
							onClear={handleClear}
						/>
						<FilterBar current={filter} onChange={setFilter} counts={counts} />
					</div>

					{/* Progress */}
					{checking && (
						<div className="space-y-2 rounded-2xl border border-[var(--primary-light)] bg-[var(--card)] p-4 shadow-lg sm:p-6">
							<div className="flex justify-between text-sm font-semibold text-[var(--border)]">
								<span>{t("results.checking_progress")}</span>
								<span>
									{checkedCount} / {links.length}
								</span>
							</div>
							<Progress value={progress} />
						</div>
					)}

					{/* Search + Group toggle */}
					<div className="flex items-center gap-2">
						<div className="relative flex-1">
							<svg
								className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]"
								width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
							</svg>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder={t("results.search_placeholder")}
								className="w-full rounded-xl border border-[var(--primary-light)] bg-[var(--card)] py-2 pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all duration-200 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/10"
							/>
						</div>
						<select
							value={groupView ? "group" : "flat"}
							onChange={(e) => setGroupView(e.target.value === "group")}
							className="appearance-none rounded-xl border border-[var(--primary-light)] bg-[var(--card)] px-3 py-2 pr-8 text-sm font-semibold text-[var(--foreground)] transition-all duration-200 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/10">
							<option value="flat" className="bg-[var(--card)]">{t("results.flat_view")}</option>
							<option value="group" className="bg-[var(--card)]">{t("results.group_view")}</option>
						</select>
					</div>

					{/* Link list */}
					<div className="overflow-hidden rounded-2xl border border-[var(--primary-light)] bg-[var(--card)] shadow-sm">
						{filteredLinks.length === 0 ? (
							<div className="p-12 text-center">
								<p className="text-sm font-semibold text-[var(--muted-foreground)]">{t("results.empty")}</p>
							</div>
						) : groupView ? (
							groupedLinks.map((group) => (
								<DomainGroup
									key={group.domain}
									domain={group.domain}
									links={group.links}
									copied={copiedId === group.domain}
									onCopy={() => handleCopyLinks(group.domain, group.links.map(l => l.url))}
									onDelete={handleDelete}
									onReverify={handleReverify}
								/>
							))
						) : (
							<>
								<div className="flex items-center justify-end gap-2 border-b border-[var(--primary-light)] px-4 py-2">
									<button
										onClick={() => handleCopyLinks("flat", filteredLinks.map(l => l.url))}
										className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
										</svg>
										{copiedId === "flat" ? t("action_bar.copied") : t("action_bar.copy")}
									</button>
								</div>
								{filteredLinks.map((link) => (
									<LinkCard key={link.id} link={link} onDelete={handleDelete} onReverify={handleReverify} />
								))}
							</>
						)}
					</div>

					<div className="pt-4 text-center text-xs font-semibold text-[var(--muted-foreground)]/60">
						{t("results.showing", { filtered: filteredLinks.length, total: links.length })}
					</div>
				</div>
			)}

			{/* ─── FEATURES ─── */}
			<section className="border-b border-[var(--primary-light)] bg-[var(--card)] py-24 lg:py-28">
				<div className="mx-auto max-w-7xl px-4">
					{/* Header */}
					<div className="mx-auto mb-16 max-w-2xl text-center">
						<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--primary-light)] px-4 py-1.5">
							<span className="h-2 w-2 rounded-full bg-white" />
							<span className="text-xs font-semibold text-white ">{t("features.badge")}</span>
						</div>
						<h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-[var(--foreground)]">
							{t("features.title")} <span className="text-[var(--primary)]">{t("features.title_highlight")}</span>
						</h2>
						<p className="mt-4 text-base font-medium leading-relaxed text-[var(--muted-foreground)]">
							{t("features.description")}
						</p>
					</div>

					{/* Feature cards */}
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{[
							{ icon: <IconLink className="h-6 w-6 text-white" /> },
							{ icon: <IconClock className="h-6 w-6 text-white" /> },
							{ icon: <IconDownload className="h-6 w-6 text-white" /> },
							{ icon: <IconShield className="h-6 w-6 text-white" /> },
							{ icon: <IconActivity className="h-6 w-6 text-white" /> },
							{ icon: <IconRefresh className="h-6 w-6 text-white" /> },
						].map(({ icon }, i) => (
							<div
								key={i}
								className="group rounded-2xl border border-[var(--primary-light)] bg-[var(--card)] p-8 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
								<div className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary-light)] transition-transform duration-200 group-hover:scale-110">
									{icon}
								</div>
								<h3 className="mb-2 text-xl font-bold text-[var(--foreground)]">{featuresItems[i]?.title ?? ""}</h3>
								<p className="text-sm font-medium leading-relaxed text-[var(--muted-foreground)]">
									{featuresItems[i]?.description ?? ""}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── HOW IT WORKS ─── */}
			<section className="border-b border-[var(--primary-light)] bg-[#0f1b05] dark:bg-[#0a1a04] py-24 lg:py-28">
				<div className="relative mx-auto max-w-7xl px-4">
					<div className="mx-auto mb-16 max-w-2xl text-center">
						<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-1.5">
							<span className="h-2 w-2 rounded-full bg-white" />
							<span className="text-xs font-semibold text-white">{t("how_it_works.badge")}</span>
						</div>
						<h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-white">
							{t("how_it_works.title")}
						</h2>
						<p className="mt-4 text-base font-medium leading-relaxed text-white/60">{t("how_it_works.description")}</p>
					</div>

					<div className="relative grid gap-8 md:grid-cols-3">
						{[
							{ step: "1", color: "bg-[var(--primary)]" },
							{ step: "2", color: "bg-[var(--primary-dark)]" },
							{ step: "3", color: "bg-[var(--primary)]" },
						].map(({ step, color }, i) => (
							<div key={i} className="relative text-center">
								<div
									className={`relative mx-auto mb-6 flex h-20 w-20 items-center justify-center ${color} rounded-2xl shadow-lg`}>
									<span className="text-3xl font-bold text-white">{step}</span>
								</div>
								<h3 className="mb-3 text-xl font-bold text-white">{howItWorksSteps[i]?.title ?? ""}</h3>
								<p className="mx-auto max-w-xs text-sm font-medium leading-relaxed text-white/70">
									{howItWorksSteps[i]?.description ?? ""}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── TESTIMONIALS ─── */}
			<section className="border-b border-[var(--primary-light)] bg-[var(--muted)] py-24 lg:py-28">
				<div className="mx-auto max-w-7xl px-4">
					<div className="mx-auto mb-16 max-w-2xl text-center">
						<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-1.5">
							<span className="h-2 w-2 rounded-full bg-white" />
							<span className="text-xs font-semibold text-white">{t("testimonials.badge")}</span>
						</div>
						<h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-[var(--foreground)]">
							{t("testimonials.title")}{" "}
							<span className="text-[var(--primary)]">{t("testimonials.title_highlight")}</span>
						</h2>
						<p className="mt-4 text-base font-medium leading-relaxed text-[var(--muted-foreground)]">
							{t("testimonials.description")}
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						{[{ color: "var(--primary)" }, { color: "var(--primary-dark)" }, { color: "var(--primary)" }].map(
							({ color }, i) => (
								<div
									key={i}
									className="group relative rounded-2xl border border-[var(--primary-light)] bg-[var(--card)] p-8 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
									<div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl" style={{ background: color }} />

									<p className="relative mb-6 text-sm font-medium leading-relaxed text-[var(--foreground)]">
										&ldquo;{testimonialItems[i]?.quote ?? ""}&rdquo;
									</p>

									<div className="flex items-center gap-3">
										<div
											className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
											style={{ background: color }}>
											{testimonialItems[i]?.author?.[0] ?? ""}
										</div>
										<div>
											<div className="text-sm font-bold text-[var(--foreground)]">
												{testimonialItems[i]?.author ?? ""}
											</div>
											<div className="text-xs text-[var(--muted-foreground)]">{testimonialItems[i]?.role ?? ""}</div>
										</div>
									</div>
								</div>
							),
						)}
					</div>

					{/* Trust metrics row */}
					<div className="mt-16 grid grid-cols-2 gap-0 border border-[var(--primary-light)] bg-[var(--card)] shadow-md md:grid-cols-4">
						{testimonialStats.map((stat, i) => (
							<div
								key={i}
								className={`text-center p-8 bg-[var(--card)] ${i < 3 ? "border-r border-[var(--primary-light)]" : ""}`}>
								<div className="text-2xl font-bold text-[var(--foreground)]">{stat.number}</div>
								<div className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── FINAL CTA ─── */}
			<section className="border-b border-[var(--primary-light)] bg-[#0f1b05] dark:bg-[#0a1a04] py-24 lg:py-28">
				<div className="relative mx-auto max-w-3xl px-4 text-center">
					<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-1.5">
						<span className="h-2 w-2 rounded-full bg-white" />
						<span className="text-xs font-semibold text-white">{t("final_cta.badge")}</span>
					</div>

					<h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-white">
						{t("final_cta.title")}
					</h2>
					<p className="mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed text-white/70">
						{t("final_cta.description")}
					</p>

					<div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
						<button
							onClick={() => document.getElementById("input-card")?.scrollIntoView({ behavior: "smooth" })}
							className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(132,204,22,0.39)] transition-all duration-200 hover:bg-[var(--primary-dark)] hover:shadow-[0_6px_20px_-4px_rgba(132,204,22,0.5)] active:scale-[0.98]">
							<IconLink className="h-5 w-5" />
							{t("final_cta.cta")}
						</button>
						<span className="flex items-center gap-2 text-sm font-semibold text-white/60">
							<IconCheckCircle className="h-4 w-4 text-[var(--primary)]" />
							{t("final_cta.no_card")}
						</span>
					</div>

					{/* Trust indicators */}
					<div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-white/60">
						{finalCtaTrustItems.map((item, i) => (
							<span key={i}>{item}</span>
						))}
					</div>
				</div>
			</section>

			{/* ─── FOOTER ─── */}
			<footer className="bg-[#0f1b05] dark:bg-[#0a1a04] py-10">
				<div className="mx-auto max-w-7xl px-4">
					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<div className="flex items-center gap-2 text-sm font-bold text-white">
							<IconLink className="h-4 w-4 text-[var(--primary)]" />
							Link Extractor
						</div>
						<p className="text-xs font-semibold text-white/50">{t("footer.tagline")}</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
