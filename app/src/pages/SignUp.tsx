import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-primary/5 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                        Join NeuroCare
                    </h1>
                    <p className="text-muted-foreground">
                        Start your personalized wellness journey today
                    </p>
                </div>

                <div className="bg-card/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-accent/10 p-8">
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent shadow-none",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "bg-accent/10 hover:bg-accent/20 border-accent/20",
                                formButtonPrimary: "bg-accent hover:bg-accent/90",
                                footerActionLink: "text-accent hover:text-accent/80",
                            }
                        }}
                        routing="path"
                        path="/sign-up"
                        signInUrl="/login"
                        redirectUrl="/"
                    />
                </div>
            </div>
        </div>
    );
}
