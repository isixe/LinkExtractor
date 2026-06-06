import { useTranslation } from "react-i18next";
import { IconClock, IconLoader, IconCheckCircle, IconXCircle, IconAlertTriangle } from "./icons";

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

	return (
		<div className="flex items-center gap-3 border-b border-[var(--primary-light)] px-4 py-3 text-sm last:border-b-0 hover:bg-[var(--muted)] transition-colors">
			<div className={`flex-shrink-0 ${cfg.color}`}>
				<Icon />
			</div>

			<a
				href={link.url}
				target="_blank"
				rel="noopener noreferrer"
				className="min-w-0 flex-1 truncate font-semibold text-black dark:text-[var(--primary)] hover:underline">
				{link.url}
			</a>

			{link.errorMessage && (
				<span className="max-w-[200px] truncate text-xs text-[var(--error)]">{link.errorMessage}</span>
			)}

			<div className="flex flex-shrink-0 items-center gap-2">
				<span className={`whitespace-nowrap text-xs font-medium ${cfg.color}`}>
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
