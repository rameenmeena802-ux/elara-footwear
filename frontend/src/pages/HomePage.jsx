import Hero3D from '../components/Hero3D';
import Gallery from '../components/Gallery';
import Anatomy from '../components/Anatomy';
import Performance from '../components/Performance';
import Catalog from '../components/Catalog';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Hero3D />
      <Gallery />
      <Anatomy />
      <Performance />
      <Catalog />
      <Footer />
    </>
  );
}