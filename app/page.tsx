import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Content from "@/components/Home/Content";



export default async function Home() {
  return (
    <div className="flex flex-col items-start justify-items-center p-8 pb-10 sm:p-20 ">
      <Header />
      <main className="flex flex-col items-center sm:items-start overflow-hidden h-full w-full ">
        <Content />
      </main>
      <Footer />
    </div>
  );
}
