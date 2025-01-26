import NavBar from '../components/NavBar';
import Home from '../components/Home';
import { Lekton } from "next/font/google";

const lektonFont = Lekton({
    subsets: ["latin"],
    weight: "400",
})

export default function Page() {
    return (
        <div>
            <div className={ lektonFont.className}>
                <NavBar/>
                <Home/>
            </div>
        </div>
    );
  }