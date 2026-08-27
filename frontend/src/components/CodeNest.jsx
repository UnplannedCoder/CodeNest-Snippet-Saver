import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCodeNestThunk } from "../redux/Slice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  Share2,
  Eye,
  Copy,
  Calendar,
  Search,
  FileText,
} from "lucide-react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";

const CodeNest = ({ isDarkMode }) => {
  const [shareId, setShareId] = useState(null);
  const navigate = useNavigate();

  const snippets = useSelector((state) => state.codenest.codenest);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = snippets.filter((snippet) =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleDelete(codeId) {
    dispatch(removeFromCodeNestThunk(codeId));
  }

  const analyzeContentType = (content) => {
    if (!content) return "TEXT";
    const codeKeywords = [
      "const ",
      "let ",
      "var ",
      "function ",
      "class ",
      "def ",
      "import ",
      "return ",
      "#include",
      "public class",
      "console.log",
    ];
    const codeSymbols = ["{", "}", ";", "=>", "()", "===", "++"];
    const hasKeyword = codeKeywords.some((keyword) =>
      content.includes(keyword),
    );
    const symbolCount = codeSymbols.filter((symbol) =>
      content.includes(symbol),
    ).length;
    if (hasKeyword || symbolCount >= 2) return "CODE";
    return "TEXT";
  };

  return (
    <div
      className={`flex flex-col items-center w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-8 sm:pb-12 min-h-[calc(100vh-65px)] transition-colors duration-300 ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
        {/* Search Bar */}
        <div className="relative w-full flex items-center">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input
            className={`border-2 p-3 pl-11 rounded-2xl w-full outline-none text-base sm:text-lg font-semibold shadow-sm transition-colors duration-300 ${
              isDarkMode
                ? "border-gray-800 bg-black text-white placeholder-gray-500"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
            }`}
            type="search"
            placeholder="Search snippet here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Outer Container */}
        <div
          className={`border-2 p-4 sm:p-6 rounded-2xl w-full flex flex-col gap-5 sm:gap-6 shadow-xl transition-colors duration-300 ${
            isDarkMode
              ? "border-gray-800 bg-black text-white"
              : "border-gray-300 bg-white text-gray-900"
          }`}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
              All Snippets
            </h2>
            {filteredData.length === 0 && (
              <p className="text-xs sm:text-sm text-gray-400">
                Create your first snippet to get started
              </p>
            )}
          </div>

          {filteredData.length > 0 ? (
            <div className="flex flex-col gap-4 sm:gap-5">
              {filteredData.map((snippet, index) => {
                const contentType = analyzeContentType(snippet.content);

                return (
                  <div
                    key={snippet._id || index}
                    className={`border-2 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "border-gray-800 bg-gray-950/60"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {/* Left Side: Title and Content */}
                    <div className="flex flex-col gap-2 w-full md:max-w-[55%] lg:max-w-[60%] shrink-0">
                      <div className="font-bold text-xl sm:text-2xl wrap-break-words text-emerald-500 dark:text-emerald-400">
                        {snippet.title}
                      </div>
                      <div
                        className={`text-xs sm:text-sm wrap-break-words line-clamp-3 sm:line-clamp-4 font-mono ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {snippet.content}
                      </div>
                    </div>

                    {/* Right Side: Action Buttons, Date, Badge */}
                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-800/40 dark:border-gray-800/80">
                      {/* Action Buttons Toolbar */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center justify-start md:justify-end w-full md:w-auto">
                        {[
                          {
                            icon: <Edit size={18} />,
                            title: "Edit",
                            onClick: () => navigate(`/?codeId=${snippet._id}`),
                          },
                          {
                            icon: <Trash2 size={18} />,
                            title: "Delete",
                            onClick: () => handleDelete(snippet._id),
                          },
                          {
                            icon: <Share2 size={18} />,
                            title: "Share",
                            onClick: () =>
                              setShareId(
                                shareId === snippet._id ? null : snippet._id,
                              ),
                          },
                          {
                            icon: <Eye size={18} />,
                            title: "View",
                            onClick: () => navigate(`/codenest/${snippet._id}`),
                          },
                          {
                            icon: <Copy size={18} />,
                            title: "Copy",
                            onClick: () => {
                              navigator.clipboard.writeText(snippet.content);
                              toast.success("Copied to Clipboard");
                            },
                          },
                        ].map((btn, i) => (
                          <button
                            key={i}
                            className={`p-2 sm:p-2.5 border rounded-xl transition cursor-pointer ${
                              isDarkMode
                                ? "border-gray-800 bg-black text-gray-50 hover:bg-gray-800 hover:text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
                            }`}
                            onClick={btn.onClick}
                            title={btn.title}
                          >
                            {btn.icon}
                          </button>
                        ))}
                      </div>

                      {/* Date and Type Badge Row */}
                      <div className="flex items-center gap-3 justify-between md:justify-end w-full md:w-auto text-xs sm:text-sm font-mono">
                        <div
                          className={`flex items-center gap-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          <Calendar size={16} />
                          <span>
                            {new Date(snippet.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>

                        <div
                          className={`px-3 py-0.5 border rounded-xl text-xs font-semibold tracking-wider ${
                            contentType === "CODE"
                              ? isDarkMode
                                ? "text-green-400 border-green-800/80 bg-green-950/40"
                                : "text-green-700 border-green-400 bg-green-50"
                              : isDarkMode
                                ? "text-blue-400 border-blue-800/80 bg-blue-950/40"
                                : "text-blue-700 border-blue-400 bg-blue-50"
                          }`}
                        >
                          {contentType}
                        </div>
                      </div>

                      {/* Social Share Popout */}
                      {shareId === snippet._id && (
                        <div
                          className={`flex justify-center gap-2 mt-1 p-2 rounded-xl border w-full md:w-auto ${
                            isDarkMode
                              ? "bg-gray-900 border-gray-800"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <FacebookShareButton
                            url={`${window.location.origin}/codenest/${snippet._id}`}
                            hashtag="#CodeNest"
                          >
                            <FacebookIcon size={26} round />
                          </FacebookShareButton>
                          <TwitterShareButton
                            url={`${window.location.origin}/codenest/${snippet._id}`}
                            title={snippet.title}
                          >
                            <TwitterIcon size={26} round />
                          </TwitterShareButton>
                          <WhatsappShareButton
                            url={`${window.location.origin}/codenest/${snippet._id}`}
                            title={snippet.title}
                          >
                            <WhatsappIcon size={26} round />
                          </WhatsappShareButton>
                          <LinkedinShareButton
                            url={`${window.location.origin}/codenest/${snippet._id}`}
                          >
                            <LinkedinIcon size={26} round />
                          </LinkedinShareButton>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={`border border-dashed rounded-2xl p-8 sm:p-16 flex flex-col items-center justify-center gap-4 my-2 text-center ${
                isDarkMode
                  ? "border-gray-800 bg-black/40 text-white"
                  : "border-gray-300 bg-gray-50 text-gray-900"
              }`}
            >
              <div
                className={`p-3 sm:p-4 rounded-2xl border ${isDarkMode ? "bg-gray-900 border-gray-800 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
              >
                <FileText size={28} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg sm:text-xl font-bold">
                  No snippets yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Create your first snippet to share code snippets or text.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeNest;
