import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/lib/types";

interface Props {
  current: OrderStatus;
}

export default function OrderStatusTracker({ current }: Props) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(current);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between">
      {ORDER_STATUS_FLOW.map((status, index) => {
        const done = index <= currentIndex;
        const active = index === currentIndex;
        return (
          <li
            key={status}
            className="relative flex flex-1 flex-col items-center pb-8 sm:pb-0"
          >
            {index < ORDER_STATUS_FLOW.length - 1 && (
              <span
                className={`absolute left-1/2 top-4 hidden h-0.5 w-full sm:block ${
                  index < currentIndex ? "bg-brand-600" : "bg-stone-200"
                }`}
                style={{ transform: "translateX(50%)" }}
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? active
                    ? "bg-brand-600 text-white ring-4 ring-brand-100"
                    : "bg-brand-600 text-white"
                  : "bg-stone-200 text-stone-500"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`mt-2 text-center text-xs font-medium sm:text-sm ${
                active ? "text-brand-700" : done ? "text-stone-700" : "text-stone-400"
              }`}
            >
              {ORDER_STATUS_LABELS[status]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
