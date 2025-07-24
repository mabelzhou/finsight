import type { ChatCompletionTool } from "openai/resources/index.mjs";

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getCompanyProfile",
      description: "Get the company profile for a specific stock symbol.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol (e.g., AAPL, TSLA)",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTranscripts",
      description: "Get earnings call transcripts for a specific company.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
          year: {
            type: "string",
            description: "The year of the earnings call (e.g., '2025')",
          },
          quarter: {
            type: "string",
            description: "The quarter of the earnings call (e.g., '1' for Q1)",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getIncomeStatement",
      description: "Fetch the income statement for a company.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getBalanceSheet",
      description: "Fetch the balance sheet for a company.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getCashFlowStatement",
      description: "Fetch the cash flow statement for a company.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getKeyMetrics",
      description: "Fetch key financial metrics for a company.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getFinancialEstimates",
      description: "Fetch financial analyst estimates.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
          period: {
            type: "string",
            enum: ["quarterly", "annual"],
            description: "Time period of the estimates",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getRatingsSnapshot",
      description: "Fetch analyst ratings snapshot for a stock.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getHistoricalRatings",
      description: "Fetch historical analyst ratings for a stock.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getHistoricalPrice",
      description: "Get historical stock price data.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
          period: {
            type: "string",
            description: "Time series length (e.g. 1y, 30d)",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getCommoditiesQuote",
      description: "Get the latest price quote for commodities.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getNews",
      description: "Get the latest news about a stock.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock ticker symbol",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getPressReleases",
      description: "Get the latest press releases.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
];
