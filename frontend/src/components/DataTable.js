import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const DataTable = ({ data, fetchVirusTotalData, analyzeCortex }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Alert Message</TableCell>
            <TableCell>Source IP</TableCell>
            <TableCell>Destination IP</TableCell>
            <TableCell>Count</TableCell>
            <TableCell>Malicious Engines</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(row._source['@timestamp']).toLocaleString()}</TableCell>
              <TableCell>{row._source.observable_alert_message}</TableCell>
              <TableCell>{row._source.observable_src_ip}</TableCell>
              <TableCell>{row._source.observable_dst_ip || 'N/A'}</TableCell> {/* Ensure the Destination IP is accessed correctly */}
              <TableCell>{row._source.count}</TableCell>
              <TableCell>{row._source.maliciousEngines || 'N/A'}</TableCell>
              <TableCell>
                <Button onClick={() => fetchVirusTotalData(row._source.observable_src_ip)}>Fetch VirusTotal</Button>
                <Button onClick={() => analyzeCortex(row._source.observable_src_ip)}>Analyze Cortex</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
