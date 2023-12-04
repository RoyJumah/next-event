// Import necessary libraries/components
import { Box, Skeleton } from "@chakra-ui/react";

function EventDetailsSkeleton() {
  return (
    <Box className="flex justify-center gap-4 px-4 py-3">
      {[1, 2].map((index) => (
        <div key={index} className="overflow-hidden">
          <Skeleton
            height="450px"
            width="450px"
            startColor="gray.900" // Darker start color
            endColor="gray.800"
          />
        </div>
      ))}
    </Box>
  );
}

export default EventDetailsSkeleton;
