export function Footer() {
    return (
        <footer className="border-t bg-[#0F172A] text-white">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 md:px-8">
                <div className="flex flex-col items-center gap-3 md:flex-row md:gap-0">
                    <span className="font-heading text-lg font-bold">
                        <span className="text-primary">Ez</span>
                        <span className="text-white">Darta</span>
                    </span>
                    <p className="text-center text-sm leading-loose text-gray-400 md:text-left md:ml-4">
                        &copy; {new Date().getFullYear()} EzDarta. Built for Nepal&apos;s entrepreneurs.
                    </p>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="text-sm text-gray-400 font-medium hover:text-white transition-colors">Terms</a>
                    <a href="#" className="text-sm text-gray-400 font-medium hover:text-white transition-colors">Privacy</a>
                </div>
            </div>
        </footer>
    )
}
