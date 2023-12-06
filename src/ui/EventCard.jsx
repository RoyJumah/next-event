import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Tooltip } from "@chakra-ui/react";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { getTrendingEvents } from "../services/apiEvents";
import EventCardSkeleton from "../features/events/EventCardSkeleton";

function EventCard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiKey = "L9HuAjIoaLApydg4RShNzSl4kSv6mynE";
  const query = "newyork"; // Replace with the preferred city or suggestion

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await getTrendingEvents(apiKey, query);
        setEvents(eventsData.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [query, apiKey]);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ x: 0, opacity: 1 });
    //eslint-disable-next-line
  }, [events]);

  return (
    <div className="mx-auto mt-4 sm:mt-8 sm:max-w-7xl md:mt-12">
      <h2 className="neon mb-2 text-center text-xl font-bold sm:text-3xl md:text-5xl">
        TRENDING EVENTS
      </h2>

      {loading ? (
        <EventCardSkeleton />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ x: 300, opacity: 0 }}
              animate={controls}
              transition={{ duration: 0.75, delay: 0.3 }}
              className="overflow-hidden"
            >
              <Link
                className="relative flex w-[300px] flex-col rounded-md border border-stone-800 sm:h-[400px] sm:w-[400px]"
                to={`/event/${event.id}`}
              >
                {i === 1 && (
                  <Tooltip
                    label="Trending Worldwide 🌍"
                    aria-label="A tooltip"
                    hasArrow
                    arrowSize={15}
                  >
                    <img
                      src="https://fgfppclstifnqgadpqux.supabase.co/storage/v1/object/public/next-event-images/hot2x.gif"
                      alt="Trending"
                      className="absolute right-0 top-0 h-auto w-8 pt-1"
                    />
                  </Tooltip>
                )}
                <img
                  src={event.images[2].url}
                  alt={event.name}
                  className="h-64 w-full"
                />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 p-2">
                    <span className="inline-block">
                      <FaLocationDot size={16} />
                    </span>
                    <h2 className="text-slate-400">
                      {event._embedded?.venues[0].address.line1},{" "}
                      {event._embedded?.venues[0].city.name}
                    </h2>
                  </div>

                  <h1 className="p-2 font-medium tracking-wide">
                    {event.name}
                  </h1>
                  <div className="p-2">
                    <p className="text-sm">
                      {event.info
                        ? event.info.split(" ").slice(0, 15).join(" ") + "..."
                        : "No event description provided"}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventCard;
