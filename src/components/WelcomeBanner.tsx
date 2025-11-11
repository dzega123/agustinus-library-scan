interface WelcomeBannerProps {
  visitorCount: number;
}

const WelcomeBanner = ({ visitorCount }: WelcomeBannerProps) => {
  return (
    <div className="bg-secondary/50 py-8 text-center">
      <h2 className="text-3xl font-semibold text-foreground mb-2">Selamat Datang</h2>
      <p className="text-xl text-foreground">Di Perpustakaan Agustinus</p>
      <p className="text-primary mt-2">({visitorCount} pengunjung hari ini)</p>
    </div>
  );
};

export default WelcomeBanner;
