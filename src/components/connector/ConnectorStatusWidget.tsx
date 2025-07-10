import { PieChart } from '@mui/x-charts';


const ConnectorStatusWidget = ({ connectorStatusCounts }: { connectorStatusCounts: Record<string, number> }) => {


  const getColorForStatus = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return '#06d6a0'; // Green
      case 'STARTING':
        return '#758bfd'; // Blue
      case 'STOPPED':
        return '#ef476f'; // Red
      default:
        return '#CCCCCC'; // Grey
    }
  };

  // check if connector status info is available
  if (!connectorStatusCounts || Object.keys(connectorStatusCounts).length === 0) {
    console.error('connectorStatusCounts is empty or undefined:', connectorStatusCounts);
    return <p>No data available to display the pie chart.</p>;
  }

  // converting data for the pie chart
  const pieChartData = Object.entries(connectorStatusCounts).map(([status, count], index) => ({
    id: index + 1,          
    value: count as number, 
    label: status,
    color: getColorForStatus(status),
  }));
  return (
    <div
      style={{
        border: '1px solid #ccc', // Frame around the box.
        borderRadius: '8px',      // Round corners.
        padding: '16px',          // Inner distance.
        backgroundColor: '#00000',  
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        display: 'inline-block',  
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Connector States</h2>
        <PieChart
          title='Connector states'
          height={250}
          width={400}
          slotProps={{
            legend: {
              position: { vertical: 'middle', horizontal: 'right' }, // Legend on the right side.
            },
          }}
          series={[
            {
              data: pieChartData,
              innerRadius: 60,
              outerRadius: 120,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: -125,
              endAngle: 125,
              cx: 120,
              cy: 150,
            },
          ]}
        />
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
        </div>
    </div>
  );
};

export default ConnectorStatusWidget;