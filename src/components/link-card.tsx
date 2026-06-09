import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconClock, IconLoader, IconCheck, IconCheckCircle, IconXCircle, IconAlertTriangle, IconCopy } from "./icons";

interface LinkCardProps {
	link: LinkInfo;
	onDelete?: (id: string) => void;
	onReverify?: (id: string) => void;
}

const statusConfig = {
	pending: { icon: IconClock, color: "text-[var(--muted-foreground)]" },
	checking: { icon: IconLoader, color: "text-[var(--primary)]" },
	success: { icon: IconCheckCircle, color: "text-[var(--success)]" },
	error: { icon: IconXCircle, color: "text-[var(--error)]" },
	timeout: { icon: IconAlertTriangle, color: "text-[var(--warning)]" },
};

export function LinkCard({ link, onDelete, onReverify }: LinkCardProps) {
	const { t } = useTranslation();
	const cfg = statusConfig[link.status];
	const Icon = cfg.icon;
	const [copied, setCopied] = useState(false);

	const handleCopy = async (e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(link.url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {}
	};

	return (
		<div className="flex items-center gap-2 border-b border-[var(--primary-light)] px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm last:border-b-0 hover:bg-[var(--muted)] transition-colors">
			<div className={`flex-shrink-0 ${cfg.color}`}>
				<Icon />
			</div>

			<span className="min-w-0 flex-1 truncate font-semibold text-[var(--muted-foreground)] flex items-center gap-1.5">
				<a
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					className="truncate dark:text-white text-[var(--primary)] hover:underline">
					{link.url}
				</a>
				<button
					onClick={handleCopy}
					className="flex-shrink-0 text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
					title={t("action_bar.copy")}>
					{copied ? <IconCheck className="text-[var(--success)]" /> : <IconCopy />}
				</button>
			</span>

			{link.errorMessage && (
				<span className="max-w-[200px] truncate text-[10px] sm:text-xs text-[var(--error)]">{link.errorMessage}</span>
			)}

			<div className="flex flex-shrink-0 items-center gap-1.5">
				<span className={`whitespace-nowrap text-[10px] sm:text-xs font-medium ${cfg.color}`}>
					{t(`link_card.${link.status}`)}
					{link.statusCode !== undefined && ` (${link.statusCode})`}
				</span>

				{(link.status === "error" || link.status === "timeout") && (
					<button
						onClick={() => onReverify?.(link.id)}
						className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
						title={t("link_card.reverify_title")}>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<polyline points="23 4 23 10 17 10" />
							<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
						</svg>
					</button>
				)}
				{onDelete && (
					<button
						onClick={() => onDelete(link.id)}
						className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--error)]"
						title={t("link_card.delete_title")}>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<polyline points="3 6 5 6 21 6" />
							<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
						</svg>
					</button>
				)}
			</div>
		</div>
	);
}
