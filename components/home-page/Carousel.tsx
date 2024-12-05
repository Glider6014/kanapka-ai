import * as React from "react"
 
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CustomCarousel() {
  const items = [
    {
      title: "Creation of recipes",
      description:
        "Uporządkuj zadania, pilnuj terminów i koordynuj działania członków zespołu dzięki Trello.",
      icon: "🍔",
      bgColor: "bg-red-500",
    },
    {
      title: "Spotkania",
      description:
        "Zwiększ jakość spotkań swojego zespołu, aby były bardziej produktywne i przyjemne.",
      icon: "📂",
      bgColor: "bg-blue-500",
    },
    {
      title: "Onboarding",
      description:
        "Ułatw onboarding w nowej firmie lub projekcie dzięki wizualnej prezentacji.",
      icon: "🍃",
      bgColor: "bg-green-500",
    },
    {
      title: "Zarządzanie zadaniami",
      description:
        "Śledź zadania, uzupełniaj i łącz w całość jak elementy układanki.",
      icon: "📝",
      bgColor: "bg-yellow-500",
    },
    {
      title: "Zarządzanie projektami",
      description:
        "Uporządkuj zadania, pilnuj terminów i koordynuj działania członków zespołu dzięki Trello.",
      icon: "📁", 
      bgColor: "bg-red-500",
    },
    {
      title: "Spotkania",
      description:
        "Zwiększ jakość spotkań swojego zespołu, aby były bardziej produktywne i przyjemne.",
      icon: "📂",
      bgColor: "bg-blue-500",
    },
    {
      title: "Onboarding",
      description:
        "Ułatw onboarding w nowej firmie lub projekcie dzięki wizualnej prezentacji.",
      icon: "🍃",
      bgColor: "bg-green-500",
    },
    {
      title: "Zarządzanie zadaniami",
      description:
        "Śledź zadania, uzupełniaj i łącz w całość jak elementy układanki.",
      icon: "📝",
      bgColor: "bg-yellow-500",
    },
  ];

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  {/* <span className="text-2xl font-semibold">{index + 1}</span> */}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

//   return (
//     <Carousel className="w-full max-w-sm">
//       <CarouselContent className="-ml-1">
//         {items.map((item, index) => (
//           <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
//             <div className="p-1">
//               <Card className={`p-4 ${item.bgColor}`}>
//                 <CardContent className="flex flex-col items-center justify-center p-6">
//                   <span className="text-4xl">{item.icon}</span>
//                   <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
//                   <p className="mt-2 text-lg text-center">{item.description}</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious />
//       <CarouselNext />
//     </Carousel>
//   )
// }