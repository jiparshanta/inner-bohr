export function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 md:px-8">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        &copy; {new Date().getFullYear()} Nepal Company Registration. Built for entrepreneurs.
                    </p>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="text-sm font-medium hover:underline underline-offset-4">Terms</a>
                    <a href="#" className="text-sm font-medium hover:underline underline-offset-4">Privacy</a>
                </div>
            </div>
        </footer>
    )
}
