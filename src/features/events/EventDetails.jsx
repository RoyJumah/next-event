import { useEffect } from "react";
import { useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { motion, useIsPresent } from "framer-motion";

import { getEventDetails } from "../../services/apiEvents";
import { formatDate } from "../../utils/helpers";
import { MdOutlineNotificationsNone, MdFavoriteBorder } from "react-icons/md";
import { createFavorite } from "../../services/apiFavorites";
import { useUser } from "../aunthentication/useUser";

import EventDetailsSkeleton from "./EventDetailsSkeleton";

export default function EventDetails({ open }) {
  const isPresent = useIsPresent();
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const apiKey = "L9HuAjIoaLApydg4RShNzSl4kSv6mynE";
  const { id } = useParams();

  const { user } = useUser();
  const user_id = user?.id;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setTimeout(async () => {
          const eventDetailsData = await getEventDetails(apiKey, id);
          setEventDetails(eventDetailsData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setEventDetails({});
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  //below we added conditional checks to prevent errors when we are tying to access nested properties that don't exist
  const eventImage =
    eventDetails.images && eventDetails.images[2] && eventDetails.images[2].url;

  const countryCode =
    eventDetails._embedded &&
    eventDetails._embedded.venues &&
    eventDetails._embedded.venues[0] &&
    eventDetails._embedded.venues[0].country &&
    eventDetails._embedded.venues[0].country.countryCode;

  const cityName =
    eventDetails._embedded &&
    eventDetails._embedded.venues &&
    eventDetails._embedded.venues[0] &&
    eventDetails._embedded.venues[0].city &&
    eventDetails._embedded.venues[0].city.name;

  const scheduledDate =
    eventDetails._embedded &&
    eventDetails._embedded.dates &&
    eventDetails._embedded.dates.start &&
    eventDetails._embedded.dates.start.localDate;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      toast.success("Item added to favourites 😍", { autoClose: 2000 });
      queryClient.invalidateQueries("favorites");
    },
    onError: (err) => {
      console.log("Error object:", err); // Add this line
      if (err?.message === "DuplicateKeyError") {
        toast.info("Item is already a favorite 😀", { autoClose: 2000 });
      } else {
        toast.error("Something went wrong 😥", { autoClose: 2000 });
      }
    },
  });
  function handleAddToFavorites(eventDetails) {
    if (!user_id && !user) {
      open();
    } else {
      const favoriteItem = {
        user_id,
        ticketing: eventDetails.url,
        favoriteId: eventDetails.id,
        eventName: eventDetails.name,
        image: eventDetails.images?.[0]?.url,
        date: eventDetails.dates?.start?.localDate,
      };
      mutate(favoriteItem);
    }
  }

  function handleTicketPurchase(ticketUrl) {
    window.open(ticketUrl, "_blank"); // Open the ticket URL in a new tab
  }

  function handlePushNotifications() {
    if (user_id && user) {
      console.log("Push notifications");
    } else {
      open();
    }
  }

  return (
    <>
      <div className=" mx-auto max-w-7xl p-6">
        {loading ? (
          <EventDetailsSkeleton />
        ) : (
          <div className="flex flex-col gap-[36px]  sm:flex-row sm:gap-[48px]">
            <img
              src={eventImage}
              alt={eventDetails.name}
              className="sm:w-1/2"
            />
            <div className="space-y-4 sm:w-1/2 ">
              <div className="flex justify-between">
                <div></div>
                <div className="flex cursor-pointer gap-1">
                  <MdOutlineNotificationsNone
                    size={24}
                    onClick={handlePushNotifications}
                  />
                  <MdFavoriteBorder
                    size={24}
                    onClick={() => handleAddToFavorites(eventDetails)}
                  />
                </div>
              </div>
              <div className="self-center text-center">
                <h2 className="font-semibold uppercase tracking-wide">
                  {eventDetails.name}
                </h2>
                <p className="space-x-1">
                  <span> {cityName}</span>,<span>{countryCode}</span>
                </p>
                <p className="text-[16px]">
                  {scheduledDate ? formatDate(scheduledDate) : "N/A"}
                </p>
                <p className="text-[16px] font-medium">
                  {eventDetails.pleaseNote
                    ? eventDetails.pleaseNote
                    : "Event details not available 😢"}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => handleTicketPurchase(eventDetails.url)}
                    className="rounded-[50px] bg-primary px-3 py-2 uppercase tracking-wide transition-all duration-200 hover:bg-pink-200 hover:text-primary active:bg-pink-200 "
                  >
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 1.25, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 1.25, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="fixed inset-0 z-[99999] bg-secondary "
      />
    </>
  );
}
