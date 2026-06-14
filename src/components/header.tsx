import { useTranslation } from "react-i18next";
import "../locales/i18n";
import { IconGithub, IconSettings } from "../assets/icons";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";

interface HeaderProps {
	onOpenSettings?: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
	const { t } = useTranslation();

	const handleOpenSettings = () => {
		if (onOpenSettings) {
			onOpenSettings();
		} else {
			window.dispatchEvent(new CustomEvent("open-blacklist-settings"));
		}
	};

	return (
		<header className="absolute w-full z-50 bg-transparent">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
				<div className="flex items-center gap-1">
					<img src="/favicon.png" alt="favicon" className="w-10 h-10 md:w-12 md:h-12" />
					<span className="hidden md:block text-xl font-bold pt-2">LinkExtractor</span>
				</div>
				<div className="flex items-center gap-2">
					<LanguageToggle />
					<button
						onClick={handleOpenSettings}
						className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--foreground)] hover:bg-white/20 transition-colors active:scale-95"
						aria-label="Settings"
						title={t("header.settings_title")}>
						<IconSettings className="h-5 w-5" />
					</button>
					<a
						href="https://github.com/isixe/LinkExtractor"
						target="_blank"
						rel="noopener noreferrer"
						className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--foreground)] hover:bg-white/20 transition-colors active:scale-95"
						aria-label="GitHub"
						title={t("header.github_title")}>
						<IconGithub className="h-5 w-5" />
					</a>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
