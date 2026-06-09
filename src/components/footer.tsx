import { useTranslation } from "react-i18next";
import "../locales/i18n";
import { IconLink } from "./icons";

export function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="bg-[#0f1b05] dark:bg-[#0a1a04] py-10">
			<div className="mx-auto max-w-5xl px-4">
				<div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
					<div>
						<div className="flex items-center gap-2 text-sm font-bold text-white">
							<IconLink className="h-4 w-4 text-[var(--primary)]" />
							{t("footer.brand")}
						</div>
						<p className="mt-1 text-xs text-white/40">{t("footer.slogan")}</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
								{t("footer.quick_links")}
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="https://link-extractor.itea.dev/"
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs text-white/60 hover:text-[var(--primary)] transition-colors">
										LinkChecker
									</a>
								</li>
								<li>
									<a
										href="https://bookmark-checker.itea.dev/"
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs text-white/60 hover:text-[var(--primary)] transition-colors">
										BookmarkChecker
									</a>
								</li>
							</ul>
						</div>

						<div>
						<h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
							{t("footer.socials")}
						</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="https://itea.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-white/60 hover:text-[var(--primary)] transition-colors">
									{t("footer.lab")}
								</a>
							</li>
							<li>
								<a
									href="https://drifter.itea.dev/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-white/60 hover:text-[var(--primary)] transition-colors">
									{t("footer.drifter")}
								</a>
							</li>
							<li>
								<a
									href="https://sponsor.itea.dev/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-white/60 hover:text-[var(--primary)] transition-colors">
									{t("footer.sponsor")}
								</a>
							</li>
						</ul>
						</div>
					</div>
				</div>

				<div className="border-t border-white/10 mt-8 pt-6">
					<div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
						<p className="text-xs text-white/40">
							{t("footer.copyright")}
						</p>
						<p className="text-xs text-white/40">
							{t("footer.made_by")}{" "}
							<a
								href="https://github.com/isixe"
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-[var(--primary)] transition-colors">
								isixe
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
