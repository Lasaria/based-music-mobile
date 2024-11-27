export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
  
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;
    const diffInWeeks = diffInDays / 7;
  
    // Handle cases less than 1 hour
    if (diffInHours < 1) {
      return 'just now';
    }
  
    // If less than 24 hours, show hours
    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h`;
    }
  
    // If less than 7 days, show days
    if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days}d`;
    }
  
    // If 7 days or more, show weeks
    const weeks = Math.floor(diffInWeeks);
    return `${weeks}w`;
  };

export const formatCount = (count) => {
    if (count < 10000) {
      return count.toString(); // Full number up to 9,999
    } else if (count < 100000) {
      return (count / 1000).toFixed(1) + 'k'; // Format as 10.1k to 99.9k
    } else if (count < 1000000) {
      return Math.floor(count / 1000) + 'k'; // Format as 100k, 101k, etc.
    } else {
      return (count / 1000000).toFixed(1) + 'M'; // Format as 1.1M, 1.2M, etc.
    }
  };
  
  // Helper function to test different times
  const testFormatter = () => {
    const times = [
      new Date(), // now
      new Date(Date.now() - 30 * 60 * 1000),        // 30 minutes ago
      new Date(Date.now() - 2 * 60 * 60 * 1000),    // 2 hours ago
      new Date(Date.now() - 23 * 60 * 60 * 1000),   // 23 hours ago
      new Date(Date.now() - 25 * 60 * 60 * 1000),   // 1 day and 1 hour ago
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    ];
  
    return times.map(time => ({
      actual: time.toISOString(),
      formatted: formatDate(time)
    }));
  };
  
  /*
  console.log(testFormatter());
  Output:
  [
    { actual: "2024-11-08T12:34:56.789Z", formatted: "just now" },
    { actual: "2024-11-08T12:04:56.789Z", formatted: "just now" },
    { actual: "2024-11-08T10:34:56.789Z", formatted: "2h" },
    { actual: "2024-11-07T13:34:56.789Z", formatted: "23h" },
    { actual: "2024-11-07T11:34:56.789Z", formatted: "1d" },
    { actual: "2024-11-03T12:34:56.789Z", formatted: "5d" },
    { actual: "2024-10-25T12:34:56.789Z", formatted: "2w" }
  ]
  */