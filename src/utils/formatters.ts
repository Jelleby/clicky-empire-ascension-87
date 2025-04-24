
// Format large numbers using abbreviations
export const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  
  const abbreviations = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "ODc", "NDc", "Vi", "UVi", "DVi", "TVi", "QaVi", "QiVi", "SxVi", "SpVi", "OVi", "NVi", "Tg", "UTg", "DTg", "TTg", "QaTg", "QiTg", "SxTg", "SpTg", "OTg", "NTg"];
  
  // Handle negative numbers
  const sign = num < 0 ? "-" : "";
  num = Math.abs(num);
  
  // Find the appropriate abbreviation index
  const tier = Math.log10(num) / 3 | 0;
  
  if (tier === 0) return sign + num.toFixed(num % 1 === 0 ? 0 : 1);
  
  const suffix = abbreviations[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  
  // Format based on the scaled value
  let formatted;
  if (scaled < 10) {
    formatted = scaled.toFixed(2);
  } else if (scaled < 100) {
    formatted = scaled.toFixed(1);
  } else {
    formatted = scaled.toFixed(0);
  }
  
  return sign + formatted + suffix;
};

// Format time in minutes and seconds
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Calculate time to afford something
export const timeToAfford = (cost: number, currentResources: number, incomePerSecond: number): string => {
  if (currentResources >= cost) return "Now";
  if (incomePerSecond <= 0) return "Never";
  
  const secondsNeeded = (cost - currentResources) / incomePerSecond;
  
  if (secondsNeeded < 60) {
    return `${Math.ceil(secondsNeeded)}s`;
  } else if (secondsNeeded < 3600) {
    return `${Math.ceil(secondsNeeded / 60)}m`;
  } else if (secondsNeeded < 86400) {
    return `${Math.floor(secondsNeeded / 3600)}h ${Math.floor((secondsNeeded % 3600) / 60)}m`;
  } else {
    return `${Math.floor(secondsNeeded / 86400)}d ${Math.floor((secondsNeeded % 86400) / 3600)}h`;
  }
};
