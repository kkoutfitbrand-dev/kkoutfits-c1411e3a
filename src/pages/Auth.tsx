import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EmailVerificationSteps } from '@/components/EmailVerificationSteps';
import { Loader2 } from 'lucide-react';

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password must be less than 72 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(1, "Password is required")
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type SignInFormData = z.infer<typeof signInSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn, user } = useAuth();
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [showVerificationSteps, setShowVerificationSteps] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSignUp = async (data: SignUpFormData) => {
    setIsSignUpLoading(true);
    const { error } = await signUp(data.email, data.password, data.name);
    setIsSignUpLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          title: "Account Already Exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      setSignUpEmail(data.email);
      setShowVerificationSteps(true);
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account."
      });
    }
  };

  const handleSignIn = async (data: SignInFormData) => {
    setIsSignInLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsSignInLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast({
          title: "Invalid Credentials",
          description: "The email or password you entered is incorrect.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Welcome Back!",
        description: "You have been signed in successfully."
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-12 md:py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8">
            My Account
          </h1>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold mb-6">Sign In to Your Account</h2>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email Address *</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      {...signInForm.register('email')}
                      className="mt-2"
                      placeholder="your.email@example.com"
                    />
                    {signInForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {signInForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signin-password">Password *</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      {...signInForm.register('password')}
                      className="mt-2"
                      placeholder="Enter your password"
                    />
                    {signInForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {signInForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSignInLoading}>
                    {isSignInLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold mb-6">Create New Account</h2>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name *</Label>
                    <Input
                      id="signup-name"
                      {...signUpForm.register('name')}
                      className="mt-2"
                      placeholder="Enter your full name"
                    />
                    {signUpForm.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {signUpForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email Address *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      {...signUpForm.register('email')}
                      className="mt-2"
                      placeholder="your.email@example.com"
                    />
                    {signUpForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {signUpForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      {...signUpForm.register('password')}
                      className="mt-2"
                      placeholder="Minimum 8 characters"
                    />
                    {signUpForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {signUpForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password">Confirm Password *</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      {...signUpForm.register('confirmPassword')}
                      className="mt-2"
                      placeholder="Re-enter your password"
                    />
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">
                        {signUpForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSignUpLoading}>
                    {isSignUpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <Footer />

      <EmailVerificationSteps
        isOpen={showVerificationSteps}
        onClose={() => setShowVerificationSteps(false)}
        email={signUpEmail}
      />
    </div>
  );
};

export default Auth;
