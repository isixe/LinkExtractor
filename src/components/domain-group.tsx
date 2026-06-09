import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LinkCard } from "./link-card";
import { IconChevronDown, IconGlobe } from "./icons";

interface DomainGroupProps {
	domain: string;
	links: LinkInfo[];
	copied?: boolean;
	onCopy?: () => void;
	onDelete?: (id: string) => void;
	onReverify?: (id: string) => void;
}

export function DomainGroup({ domain, links, copied, onCopy, onDelete, onReverify }: DomainGroupProps) {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(true);

	return (
		<div className="border-b border-[var(--primary-light)] last:border-b-0">
			<div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-[var(--border)] hover:bg-[var(--muted)] transition-colors">
				<button
					onClick={() => setExpanded(!expanded)}
					className="flex items-center gap-2 flex-1 text-left">
					<IconChevronDown
						className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-0" : "-rotate-90"}`}
					/>
					<IconGlobe className="h-4 w-4 text-[var(--primary)]" />
					<span className="text-[var(--foreground)]">{domain}</span>
					<span className="ml-2 text-[10px] sm:text-xs font-semibold text-[var(--muted-foreground)]">
						{t("results.domain_count", { count: links.length })}
					</span>
				</button>
				{onCopy && (
					<button
						onClick={onCopy}
						className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
						title={t("action_bar.copy")}>
						{copied ? (
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--success)]">
								<polyline points="20 6 9 17 4 12" />
							</svg>
						) : (
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
							</svg>
						)}
					</button>
				)}
			</div>
			{expanded && (
				<div>
					{links.map((link) => (
						<LinkCard key={link.id} link={link} onDelete={onDelete} onReverify={onReverify} />
					))}
				</div>
			)}
		</div>
	);
}