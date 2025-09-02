import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  price: string;
  image: string;
  link: string;
};

export function ProductCard({ title, price, image, link }: Props) {
  return (
    <Card className="hover:shadow-lg transition rounded-2xl overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        <p className="text-green-600 mt-1">{price}</p>
        <Button
          asChild
          className="w-full mt-3 bg-orange-500 hover:bg-orange-600"
        >
          <a href={link} target="_blank">
            Buy Now
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
