import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentYear } from "@/lib/utils";

export async function generateStaticParams() {
  const events = await prisma.event.findMany({
    where: {
      year: {
        year: currentYear,
      },
    },
    select: {
      slug: true,
    },
  });

  return events.map((post) => ({
    slug: post.slug,
  }));
}

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const event = await prisma.event.findUnique({
    where: {
      slug,
      year: {
        year: currentYear,
      },
    },
  });

  if (!event) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 drop-shadow-lg">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-primary/5 rounded-lg p-4 md:p-6 mb-8 -mt-12 relative z-10 shadow-md">
          <div className="grid grid-cols-2 md:flex md:flex-wrap w-full md:justify-evenly gap-4 text-sm ">
            <div className="flex items-center justify-center w-fit">
              <CalendarIcon className="h-5 w-5 text-primary mr-2" />
              <div>
                <span className="block font-medium text-muted-foreground">
                  Date
                </span>
                <span>{event.date.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-center w-fit">
              <MapPinIcon className="h-5 w-5 text-primary mr-2" />
              <div>
                <span className="block font-medium text-muted-foreground">
                  Location
                </span>
                <span>{event.location}</span>
              </div>
            </div>
            <div className="flex items-center justify-center w-fit">
              <UsersIcon className="h-5 w-5 text-primary mr-2" />
              <div>
                <span className="block font-medium text-muted-foreground">
                  Volunteers
                </span>
                <span>{event.numberOfVolunteers}</span>
              </div>
            </div>
            <div className="flex items-center justify-center w-fit">
              <ClockIcon className="h-5 w-5 text-primary mr-2" />
              <div>
                <span className="block font-medium text-muted-foreground">
                  Duration
                </span>
                <span>{event.duration} hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="prose lg:prose-lg prose-primary max-w-none">
          <MDXRemote source={event.content} />
        </div>
      </div>
    </div>
  );
}
