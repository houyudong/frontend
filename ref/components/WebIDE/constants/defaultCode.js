// 默认代码模板
export const DEFAULT_CODE = `
#include "stm32f10x.h"
#include "delay.h"

// LED初始化函数
void LED_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStructure;

    // 使能GPIOB时钟
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);

    // 配置PB5为推挽输出
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOB, &GPIO_InitStructure);

    // 关闭LED
    GPIO_SetBits(GPIOB, GPIO_Pin_5);
}

int main(void)
{
    // 系统初始化
    SystemInit();

    // 初始化延时函数
    delay_init();

    // 初始化LED
    LED_Init();

    while(1)
    {
        GPIO_ResetBits(GPIOB, GPIO_Pin_5);  // LED亮
        delay_ms(500);                      // 延时500ms
        GPIO_SetBits(GPIOB, GPIO_Pin_5);    // LED灭
        delay_ms(500);                      // 延时500ms
    }
}
`;

export default DEFAULT_CODE;
