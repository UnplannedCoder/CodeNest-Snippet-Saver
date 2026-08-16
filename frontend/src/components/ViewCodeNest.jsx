import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const ViewCodeNest = ({ isDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const allSnippets = useSelector(
    (state) => state.codenest.codenest
  );

  const snippet = allSnippets.find(
    (item) => item._id === id
  );

  // If snippet doesn't exist
  if (!snippet) {
    return (
      <div className="w-full min-h-[calc(100dvh-68px)] flex items-center justify-center p-5">
        <div
          className={`text-center font-semibold ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Snippet not found
        </div>
      </div>
    );
  }

  // Copy snippet content
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.content);
      toast.success("Copied to Clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      className="
        w-full
        max-w-3xl
        mx-auto
        px-3 sm:px-4 md:px-6
        pt-2 sm:pt-4
        pb-3
        h-[calc(100dvh-68px)]
        flex
        flex-col
        overflow-hidden
      "
    >

      {/* Main Content Wrapper */}
      <div
        className="
          flex
          flex-col
          gap-2.5 sm:gap-4
          w-full
          h-full
          min-h-0
        "
      >

        {/* ================= TOP BAR ================= */}
        <div
          className="
            flex
            flex-row
            gap-2.5 sm:gap-4
            justify-between
            w-full
            items-center
            shrink-0
          "
        >

          {/* Snippet Title */}
          <input
            className={`
              border-2
              p-2.5 sm:p-3
              px-3.5 sm:px-4
              rounded-xl sm:rounded-2xl
              w-full
              outline-none
              font-semibold
              text-sm sm:text-lg
              shadow-sm
              transition-colors
              duration-300
              ${
                isDarkMode
                  ? 'border-gray-800 bg-black text-gray-300'
                  : 'border-gray-300 bg-white text-gray-900'
              }
            `}
            type="text"
            value={snippet.title}
            disabled
          />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className={`
              border-2
              px-4 sm:px-8
              py-2.5 sm:py-3
              rounded-xl sm:rounded-2xl
              font-semibold
              transition
              whitespace-nowrap
              shadow-sm
              text-sm sm:text-base
              ${
                isDarkMode
                  ? 'border-gray-800 bg-black text-gray-300 hover:bg-white hover:text-black'
                  : 'border-gray-300 bg-white text-gray-800 hover:bg-black hover:text-white'
              }
            `}
          >
            Back
          </button>

        </div>


        {/* ================= CODE WINDOW ================= */}
        <div
          className={`
            border-2
            rounded-xl sm:rounded-2xl
            w-full
            flex
            flex-col
            flex-1
            min-h-0
            shadow-xl
            overflow-hidden
            transition-colors
            duration-300
            ${
              isDarkMode
                ? 'border-gray-800 bg-black text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }
          `}
        >

          {/* ================= WINDOW HEADER ================= */}
          <div
            className={`
              flex
              justify-between
              items-center
              px-3 sm:px-4
              py-2 sm:py-3
              border-b
              shrink-0
              transition-colors
              duration-300
              ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-gray-100 border-gray-300'
              }
            `}
          >

            {/* Traffic Lights */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>


            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`
                flex
                items-center
                gap-1.5
                px-2.5 sm:px-3
                py-1 sm:py-1.5
                border
                rounded-lg
                text-xs sm:text-base
                font-medium
                transition
                ${
                  isDarkMode
                    ? 'border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800 hover:text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-200 hover:text-black'
                }
              `}
              title="Copy Code"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>

          </div>


          {/* ================= CODE CONTENT ================= */}
          <div
            className={`
              view-code-panel
              flex-1
              min-h-0
              p-2.5 sm:p-4
              font-mono
              text-xs sm:text-base
              whitespace-pre-wrap
              wrap-break-words
              overflow-y-auto
              overflow-x-hidden
              cursor-not-allowed
              transition-colors
              duration-300
              ${
                isDarkMode
                  ? 'bg-black text-gray-200'
                  : 'bg-white text-gray-800'
              }
            `}
          >
            {snippet.content}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewCodeNest;