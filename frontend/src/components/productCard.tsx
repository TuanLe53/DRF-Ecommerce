import { Badge } from "./ui/badge";

export default function ProductCard() {
    
    return (
        <div className="w-56 h-80 bg-slate-50 hover:cursor-pointer">
            <div className="h-3/5 bg-green-200">
                <p className="text-center">Hello World</p>
            </div>

            <div className="h-2/5 hover:shadow-2xl">
                <p className="product-title">New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.</p>
                <Badge>-50%</Badge>
                <p className="line-through">500,000VND</p>
                <p>250,000VND</p>
            </div>
        </div>
    )
}