'use client';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { calculatePercentage, convertFileSize } from '@/lib/utils';

const chartConfig = {
  size: {
    label: 'Size',
  },
  used: {
    label: 'Used',
    color: 'white',
  },
} satisfies ChartConfig;

export const Chart = ({ used = 0 }: { used: number }) => {
  const chartData = [{ storage: 'used', value: used, fill: 'white' }];

  return (
    <Card className="chart">
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig} className="chart-container">
          {/* 圆形环切百分比图 */}
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={Number(calculatePercentage(used)) + 90}
            innerRadius={80}
            outerRadius={110}>
            {/* 背景圆环 */}
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="polar-grid"
              polarRadius={[86, 74]}
            />
            {/* 实际进度条 */}
            <RadialBar dataKey="storage" background cornerRadius={10} />
            {/* 显示中心文字 */}
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="chart-total-percentage">
                          {used && calculatePercentage(used)
                            ? calculatePercentage(used)
                                .toString()
                                .replace(/^0+/, '')
                            : '0'}
                          %
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white/70">
                          Space used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardHeader className="chart-details">
        <CardTitle className="chart-title">Available Storage</CardTitle>
        <CardDescription className="chart-description">
          {convertFileSize(used ?? 0)} / 2GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
