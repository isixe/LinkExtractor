import { useState, useRef, useEffect, type ReactNode } from "react";

export interface SelectOption {
	value: string;
	label: ReactNode;
}

interface CustomSelectProps {
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder, className }: CustomSelectProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onPointerDown = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, []);

	const selected = options.find((o) => o.value === value);

	return (
		<div ref={ref} className={`relative ${className ?? ""}`}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className={`
					flex w-full items-center justify-between rounded-xl border px-4 py-2 text-sm font-semibold
					transition-all duration-200
					bg-[var(--card)] text-[var(--foreground)]
					focus:outline-none
					active:scale-[0.98]
					${open ? "border-[var(--primary-dark)]" : "border-[var(--primary-light)]"}
				`}>
				<span className="whitespace-nowrap">{selected ? selected.label : (placeholder ?? "")}</span>
				<svg
					className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>

			{open && (
				<div className="absolute left-0 top-full z-50 mt-1 min-w-full rounded-xl border border-[var(--primary-light)] bg-[var(--card)] overflow-hidden shadow-lg">
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								onChange(option.value);
								setOpen(false);
							}}
							className={`
								flex w-full items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-semibold transition-colors
								${option.value === value ? "text-white" : "text-[var(--foreground)] hover:bg-[var(--muted)]"}
							`}
							style={option.value === value ? { backgroundColor: "#84cc16" } : {}}>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
