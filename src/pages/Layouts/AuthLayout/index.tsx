const AuthLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="size-full animate-bg-scroll bg-white/30 bg-[url('@/assets/images/login-bg.png')] bg-cover bg-center bg-no-repeat shadow-lg backdrop-blur-md">
      <div className="flex-center h-2/5 animate-gradient-x bg-gradient-to-r from-[#198CFF] via-[#7B61FF] to-[#00D2FF] bg-[length:400%_400%] bg-clip-text text-3xl font-extrabold text-transparent">
        {title}
      </div>
      <div className="flex h-3/5 flex-col px-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
